import { Injectable } from "@nestjs/common"
import { prisma } from "@booking-journey/shared/database"
import type {
  AvailabilitySearchParams,
  RoomAvailabilityParams,
  Venue,
  AvailableRoom,
  AvailablePackage,
  PaginatedResponse,
} from "@booking-journey/shared/types"

@Injectable()
export class AvailabilityService {
  async getVenuesAvailability(params: AvailabilitySearchParams): Promise<PaginatedResponse<Venue>> {
    const { lat, lng, radius = 5000, limit = 20, offset = 0, delegates, start_date, end_date } = params

    const latitude = Number.parseFloat(lat)
    const longitude = Number.parseFloat(lng)

    // Complex query to find venues with available rooms for the specified dates and delegate count
    const venues = await prisma.$queryRaw<any[]>`
      SELECT DISTINCT
        v.*,
        (6371 * acos(
          cos(radians(${latitude})) * 
          cos(radians(CAST(v.latitude AS FLOAT))) * 
          cos(radians(CAST(v.longitude AS FLOAT)) - radians(${longitude})) + 
          sin(radians(${latitude})) * 
          sin(radians(CAST(v.latitude AS FLOAT)))
        )) * 1000 AS distance
      FROM venues v
      INNER JOIN rooms r ON v.id = r.venue_id
      WHERE 
        (${delegates}::int IS NULL OR r.max_delegates >= ${delegates}::int)
        AND (6371 * acos(
          cos(radians(${latitude})) * 
          cos(radians(CAST(v.latitude AS FLOAT))) * 
          cos(radians(CAST(v.longitude AS FLOAT)) - radians(${longitude})) + 
          sin(radians(${latitude})) * 
          sin(radians(CAST(v.latitude AS FLOAT)))
        )) * 1000 <= ${radius}
        AND NOT EXISTS (
          SELECT 1 FROM orders o 
          WHERE o.room_id = r.id 
          AND o.status IN ('confirmed', 'pending')
          AND (
            (${start_date}::timestamp IS NULL OR ${end_date}::timestamp IS NULL)
            OR (
              o.start_date <= ${end_date}::timestamp 
              AND o.end_date >= ${start_date}::timestamp
            )
          )
        )
      ORDER BY distance ASC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    const total = venues.length // Simplified - in production, you'd do a separate count query

    return {
      items: venues.map(this.mapVenueToResponse),
      results: venues.length,
      total_results: total,
      offset,
      limit,
    }
  }

  async getVenueRoomAvailability(venueId: number, params: RoomAvailabilityParams): Promise<AvailableRoom[]> {
    const rooms = await prisma.room.findMany({
      where: {
        venue_id: venueId,
        ...(params.delegates && {
          max_delegates: { gte: params.delegates },
          min_delegates: { lte: params.delegates },
        }),
      },
      include: {
        venue: true,
      },
    })

    // Check availability for each room
    const availableRooms: AvailableRoom[] = []

    for (const room of rooms) {
      const isAvailable = await this.checkRoomAvailability(room.id, params.start_date, params.end_date)

      if (isAvailable) {
        availableRooms.push(this.mapRoomToAvailableRoom(room, params))
      }
    }

    return availableRooms
  }

  async getVenuePackageAvailability(venueId: number, params: RoomAvailabilityParams): Promise<AvailablePackage[]> {
    const packages = await prisma.package.findMany({
      where: {
        venue_id: venueId,
        ...(params.delegates && {
          max_delegates: { gte: params.delegates },
          min_delegates: { lte: params.delegates },
        }),
      },
      include: {
        venue: true,
      },
    })

    // Check if all rooms in package are available
    const availablePackages: AvailablePackage[] = []

    for (const pkg of packages) {
      const roomIds = Array.isArray(pkg.rooms) ? pkg.rooms : []
      let allRoomsAvailable = true

      for (const roomId of roomIds) {
        const isAvailable = await this.checkRoomAvailability(roomId, params.start_date, params.end_date)
        if (!isAvailable) {
          allRoomsAvailable = false
          break
        }
      }

      if (allRoomsAvailable) {
        availablePackages.push(this.mapPackageToAvailablePackage(pkg, params))
      }
    }

    return availablePackages
  }

  async getDayAvailability(venueId: number, date: string): Promise<{ id: number; availability: string }[]> {
    const rooms = await prisma.room.findMany({
      where: { venue_id: venueId },
    })

    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    const availability = []

    for (const room of rooms) {
      const bookingCount = await prisma.order.count({
        where: {
          room_id: room.id,
          status: { in: ["confirmed", "pending"] },
          start_date: { lte: dayEnd },
          end_date: { gte: dayStart },
        },
      })

      availability.push({
        id: room.id,
        availability: bookingCount > 0 ? "booked" : "available",
      })
    }

    return availability
  }

  async getMeetingRoomAvailability(roomId: number, params: any): Promise<AvailableRoom> {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        venue: true,
      },
    })

    if (!room) {
      throw new Error("Room not found")
    }

    const isAvailable = await this.checkRoomAvailability(roomId, params.start_date, params.end_date)

    return {
      ...this.mapRoomToAvailableRoom(room, params),
      instant_bookable: room.instant_bookable && isAvailable,
    }
  }

  async getPackageAvailability(packageId: number, params: any): Promise<AvailablePackage> {
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
        venue: true,
      },
    })

    if (!pkg) {
      throw new Error("Package not found")
    }

    return this.mapPackageToAvailablePackage(pkg, params)
  }

  private async checkRoomAvailability(roomId: number, startDate?: string, endDate?: string): Promise<boolean> {
    if (!startDate || !endDate) {
      return true // If no dates specified, assume available
    }

    const conflictingBookings = await prisma.order.count({
      where: {
        room_id: roomId,
        status: { in: ["confirmed", "pending"] },
        start_date: { lte: new Date(endDate) },
        end_date: { gte: new Date(startDate) },
      },
    })

    return conflictingBookings === 0
  }

  private mapVenueToResponse(venue: any): Venue {
    return {
      id: venue.id,
      name: venue.name,
      address: {
        street: venue.street,
        postal_code: venue.postal_code,
        city: venue.city,
        country: venue.country,
      },
      latitude: venue.latitude.toString(),
      longitude: venue.longitude.toString(),
      summary: venue.summary,
      images: venue.images || [],
      currency: venue.currency,
      max_delegates: venue.max_delegates,
      starting_price_cents: venue.starting_price_cents,
    }
  }

  private mapRoomToAvailableRoom(room: any, params: any): AvailableRoom {
    // Calculate pricing based on room, dates, and delegate count
    const basePrice = 12500 // This would come from pricing rules
    const taxRate = 0.2
    const amount = basePrice
    const amountIncTax = Math.round(amount * (1 + taxRate))

    return {
      availability_id: `room_${room.id}_${Date.now()}`,
      name: room.name,
      id: room.id,
      venue_id: room.venue_id,
      min_delegates: room.min_delegates,
      max_delegates: room.max_delegates,
      amount_inc_tax: amountIncTax,
      amount: amount,
      currency: room.venue.currency,
      instant_bookable: room.instant_bookable,
      credit_card_required: room.credit_card_required,
      description: room.description,
      images: room.images || [],
      equipments: room.equipments || [],
      layouts: room.layouts || [],
      dimensions: room.dimensions,
    }
  }

  private mapPackageToAvailablePackage(pkg: any, params: any): AvailablePackage {
    // Calculate package pricing
    const basePrice = 37500 // This would come from pricing rules
    const taxRate = 0.2
    const amount = basePrice
    const amountIncTax = Math.round(amount * (1 + taxRate))

    return {
      availability_id: `package_${pkg.id}_${Date.now()}`,
      name: pkg.name,
      min_delegates: pkg.min_delegates,
      max_delegates: pkg.max_delegates,
      amount_inc_tax: amountIncTax,
      amount: amount,
      price_adjusted_for_min_delegates: false,
      rooms: pkg.rooms || [],
      info: pkg.info,
      includes: pkg.includes || [],
    }
  }
}
