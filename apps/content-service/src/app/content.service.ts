import { Injectable, NotFoundException } from "@nestjs/common"
import { prisma } from "@booking-journey/shared/database"
import type { Venue, Room, Addon } from "@booking-journey/shared/types"

@Injectable()
export class ContentService {
  async getVenueDetails(id: number, lang?: string): Promise<Venue> {
    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        rooms: {
          orderBy: { name: "asc" },
        },
        packages: {
          orderBy: { name: "asc" },
        },
        addons: {
          orderBy: { category: "asc" },
        },
      },
    })

    if (!venue) {
      throw new NotFoundException(`Venue with ID ${id} not found`)
    }

    return this.mapVenueToResponse(venue)
  }

  async getVenueAddons(venueId: number, params: any): Promise<Addon[]> {
    const addons = await prisma.addon.findMany({
      where: {
        venue_id: venueId,
        ...(params.category && { category: params.category }),
        ...(params.package_addon !== undefined && { package_addon: params.package_addon }),
      },
      orderBy: [{ category: "asc" }, { description: "asc" }],
    })

    return addons.map(this.mapAddonToResponse)
  }

  async getRoomDetails(id: number, lang?: string): Promise<Room> {
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        venue: true,
      },
    })

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`)
    }

    return this.mapRoomToResponse(room)
  }

  async getVenueRooms(venueId: number, params: any): Promise<Room[]> {
    const rooms = await prisma.room.findMany({
      where: {
        venue_id: venueId,
        ...(params.min_delegates && { min_delegates: { lte: params.min_delegates } }),
        ...(params.max_delegates && { max_delegates: { gte: params.max_delegates } }),
        ...(params.instant_bookable !== undefined && { instant_bookable: params.instant_bookable }),
      },
      orderBy: { name: "asc" },
    })

    return rooms.map(this.mapRoomToResponse)
  }

  async createVenue(venueData: any): Promise<Venue> {
    const venue = await prisma.venue.create({
      data: {
        name: venueData.name,
        street: venueData.address.street,
        postal_code: venueData.address.postal_code,
        city: venueData.address.city,
        country: venueData.address.country,
        latitude: venueData.latitude,
        longitude: venueData.longitude,
        summary: venueData.summary,
        language_summary: venueData.language_summary,
        images: venueData.images,
        currency: venueData.currency,
        max_delegates: venueData.max_delegates,
        starting_price_cents: venueData.starting_price_cents,
        facilities: venueData.facilities,
        nearby: venueData.nearby,
        additionals: venueData.additionals,
        sports: venueData.sports,
        package_addon: venueData.package_addon,
      },
    })

    return this.mapVenueToResponse(venue)
  }

  async updateVenue(id: number, venueData: any): Promise<Venue> {
    const venue = await prisma.venue.update({
      where: { id },
      data: {
        ...(venueData.name && { name: venueData.name }),
        ...(venueData.address?.street && { street: venueData.address.street }),
        ...(venueData.address?.postal_code && { postal_code: venueData.address.postal_code }),
        ...(venueData.address?.city && { city: venueData.address.city }),
        ...(venueData.address?.country && { country: venueData.address.country }),
        ...(venueData.latitude && { latitude: venueData.latitude }),
        ...(venueData.longitude && { longitude: venueData.longitude }),
        ...(venueData.summary && { summary: venueData.summary }),
        ...(venueData.language_summary && { language_summary: venueData.language_summary }),
        ...(venueData.images && { images: venueData.images }),
        ...(venueData.currency && { currency: venueData.currency }),
        ...(venueData.max_delegates && { max_delegates: venueData.max_delegates }),
        ...(venueData.starting_price_cents && { starting_price_cents: venueData.starting_price_cents }),
        ...(venueData.facilities && { facilities: venueData.facilities }),
        ...(venueData.nearby && { nearby: venueData.nearby }),
        ...(venueData.additionals && { additionals: venueData.additionals }),
        ...(venueData.sports && { sports: venueData.sports }),
        ...(venueData.package_addon !== undefined && { package_addon: venueData.package_addon }),
        updated_at: new Date(),
      },
    })

    return this.mapVenueToResponse(venue)
  }

  async deleteVenue(id: number): Promise<void> {
    await prisma.venue.delete({
      where: { id },
    })
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
      language_summary: venue.language_summary,
      images: venue.images || [],
      currency: venue.currency,
      max_delegates: venue.max_delegates,
      starting_price_cents: venue.starting_price_cents,
      facilities: venue.facilities || [],
      nearby: venue.nearby || [],
      additionals: venue.additionals || [],
      sports: venue.sports || [],
      package_addon: venue.package_addon,
    }
  }

  private mapRoomToResponse(room: any): Room {
    return {
      id: room.id,
      name: room.name,
      min_delegates: room.min_delegates,
      max_delegates: room.max_delegates,
      instant_bookable: room.instant_bookable,
      credit_card_required: room.credit_card_required,
      description: room.description,
      images: room.images || [],
      equipments: room.equipments || [],
      layouts: room.layouts || [],
      dimensions: room.dimensions,
    }
  }

  private mapAddonToResponse(addon: any): Addon {
    return {
      id: addon.id,
      description: addon.description,
      category: addon.category,
      currency: addon.currency,
      amount: Number(addon.amount),
      amount_inc_tax: Number(addon.amount_inc_tax),
      unit: addon.unit,
      available_rooms: addon.available_rooms || [],
      package_addon: addon.package_addon,
      available_packages: addon.available_packages || [],
    }
  }
}
