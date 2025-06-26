import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { VenueEntity } from "../entities/venue.entity"
import type { RoomEntity } from "../entities/room.entity"
import type { PackageEntity } from "../entities/package.entity"
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
  constructor(
    private readonly venueRepository: Repository<VenueEntity>,
    private readonly roomRepository: Repository<RoomEntity>,
    private readonly packageRepository: Repository<PackageEntity>,
  ) {}

  async getVenuesAvailability(params: AvailabilitySearchParams): Promise<PaginatedResponse<Venue>> {
    const { lat, lng, radius = 5000, limit = 20, offset = 0, delegates } = params

    const latitude = Number.parseFloat(lat)
    const longitude = Number.parseFloat(lng)

    const query = this.venueRepository
      .createQueryBuilder("venue")
      .select([
        "venue.*",
        `(6371 * acos(cos(radians(${latitude})) * cos(radians(venue.latitude)) * cos(radians(venue.longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(venue.latitude)))) * 1000 AS distance`,
      ])
      .where("venue.max_delegates >= :delegates", { delegates })
      .having("distance <= :radius", { radius })
      .orderBy("distance", "ASC")
      .limit(limit)
      .offset(offset)

    const [venues, total] = await Promise.all([query.getRawMany(), query.getCount()])

    return {
      items: venues.map(this.mapVenueEntityToVenue),
      results: venues.length,
      total_results: total,
      offset,
      limit,
    }
  }

  async getVenueRoomAvailability(venueId: number, params: RoomAvailabilityParams): Promise<AvailableRoom[]> {
    const rooms = await this.roomRepository.find({
      where: {
        venue_id: venueId,
        max_delegates: params.delegates ? { $gte: params.delegates } : undefined,
      },
    })

    return rooms.map((room) => this.mapRoomToAvailableRoom(room, params))
  }

  async getVenuePackageAvailability(venueId: number, params: RoomAvailabilityParams): Promise<AvailablePackage[]> {
    const packages = await this.packageRepository.find({
      where: {
        venue_id: venueId,
        max_delegates: params.delegates ? { $gte: params.delegates } : undefined,
      },
    })

    return packages.map((pkg) => this.mapPackageToAvailablePackage(pkg, params))
  }

  async getDayAvailability(venueId: number, date: string): Promise<{ id: number; availability: string }[]> {
    const rooms = await this.roomRepository.find({
      where: { venue_id: venueId },
    })

    return rooms.map((room) => ({
      id: room.id,
      availability: "available", // This would be calculated based on actual bookings
    }))
  }

  async getMeetingRoomAvailability(roomId: number, params: any): Promise<AvailableRoom> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    })

    if (!room) {
      throw new Error("Room not found")
    }

    return this.mapRoomToAvailableRoom(room, params)
  }

  async getPackageAvailability(packageId: number, params: any): Promise<AvailablePackage> {
    const pkg = await this.packageRepository.findOne({
      where: { id: packageId },
    })

    if (!pkg) {
      throw new Error("Package not found")
    }

    return this.mapPackageToAvailablePackage(pkg, params)
  }

  private mapVenueEntityToVenue(entity: any): Venue {
    return {
      id: entity.venue_id,
      name: entity.venue_name,
      address: {
        street: entity.venue_street,
        postal_code: entity.venue_postal_code,
        city: entity.venue_city,
        country: entity.venue_country,
      },
      latitude: entity.venue_latitude.toString(),
      longitude: entity.venue_longitude.toString(),
      summary: entity.venue_summary,
      images: entity.venue_images ? JSON.parse(entity.venue_images) : [],
      currency: entity.venue_currency,
      max_delegates: entity.venue_max_delegates,
      starting_price_cents: entity.venue_starting_price_cents,
    }
  }

  private mapRoomToAvailableRoom(room: any, params: any): AvailableRoom {
    return {
      availability_id: `room_${room.id}_${Date.now()}`,
      name: room.name,
      id: room.id,
      venue_id: room.venue_id,
      min_delegates: room.min_delegates,
      max_delegates: room.max_delegates,
      amount_inc_tax: 15000, // This would be calculated based on pricing rules
      amount: 12500,
      currency: "EUR",
      instant_bookable: room.instant_bookable,
      credit_card_required: room.credit_card_required,
      description: room.description,
      images: room.images ? JSON.parse(room.images) : [],
      equipments: room.equipments ? JSON.parse(room.equipments) : [],
      layouts: room.layouts ? JSON.parse(room.layouts) : [],
      dimensions: room.dimensions ? JSON.parse(room.dimensions) : undefined,
    }
  }

  private mapPackageToAvailablePackage(pkg: any, params: any): AvailablePackage {
    return {
      availability_id: `package_${pkg.id}_${Date.now()}`,
      name: pkg.name,
      min_delegates: pkg.min_delegates,
      max_delegates: pkg.max_delegates,
      amount_inc_tax: 45000, // This would be calculated based on pricing rules
      amount: 37500,
      price_adjusted_for_min_delegates: false,
      rooms: pkg.rooms ? JSON.parse(pkg.rooms) : [],
      info: pkg.info,
      includes: pkg.includes ? JSON.parse(pkg.includes) : [],
    }
  }
}
