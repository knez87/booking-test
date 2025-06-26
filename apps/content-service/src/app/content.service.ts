import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { VenueEntity } from "../entities/venue.entity"
import type { RoomEntity } from "../entities/room.entity"
import type { AddonEntity } from "../entities/addon.entity"
import type { Venue, Room, Addon } from "@booking-journey/shared/types"

@Injectable()
export class ContentService {
  constructor(
    private readonly venueRepository: Repository<VenueEntity>,
    private readonly roomRepository: Repository<RoomEntity>,
    private readonly addonRepository: Repository<AddonEntity>,
  ) {}

  async getVenueDetails(id: number, lang?: string): Promise<Venue> {
    const venue = await this.venueRepository.findOne({
      where: { id },
      relations: ["rooms", "packages", "facilities"],
    })

    if (!venue) {
      throw new Error("Venue not found")
    }

    return this.mapVenueEntityToVenue(venue)
  }

  async getVenueAddons(venueId: number, params: any): Promise<Addon[]> {
    const addons = await this.addonRepository.find({
      where: { venue_id: venueId },
    })

    return addons.map(this.mapAddonEntityToAddon)
  }

  async getRoomDetails(id: number, lang?: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ["equipments", "layouts"],
    })

    if (!room) {
      throw new Error("Room not found")
    }

    return this.mapRoomEntityToRoom(room)
  }

  private mapVenueEntityToVenue(entity: any): Venue {
    return {
      id: entity.id,
      name: entity.name,
      address: {
        street: entity.street,
        postal_code: entity.postal_code,
        city: entity.city,
        country: entity.country,
      },
      latitude: entity.latitude.toString(),
      longitude: entity.longitude.toString(),
      summary: entity.summary,
      language_summary: entity.language_summary,
      images: entity.images ? JSON.parse(entity.images) : [],
      currency: entity.currency,
      max_delegates: entity.max_delegates,
      starting_price_cents: entity.starting_price_cents,
      facilities: entity.facilities ? JSON.parse(entity.facilities) : [],
      nearby: entity.nearby ? JSON.parse(entity.nearby) : [],
      additionals: entity.additionals ? JSON.parse(entity.additionals) : [],
      sports: entity.sports ? JSON.parse(entity.sports) : [],
      package_addon: entity.package_addon,
    }
  }

  private mapRoomEntityToRoom(entity: any): Room {
    return {
      id: entity.id,
      name: entity.name,
      min_delegates: entity.min_delegates,
      max_delegates: entity.max_delegates,
      instant_bookable: entity.instant_bookable,
      credit_card_required: entity.credit_card_required,
      description: entity.description,
      images: entity.images ? JSON.parse(entity.images) : [],
      equipments: entity.equipments ? JSON.parse(entity.equipments) : [],
      layouts: entity.layouts ? JSON.parse(entity.layouts) : [],
      dimensions: entity.dimensions ? JSON.parse(entity.dimensions) : undefined,
    }
  }

  private mapAddonEntityToAddon(entity: any): Addon {
    return {
      id: entity.id,
      description: entity.description,
      category: entity.category,
      currency: entity.currency,
      amount: entity.amount,
      amount_inc_tax: entity.amount_inc_tax,
      unit: entity.unit,
      available_rooms: entity.available_rooms ? JSON.parse(entity.available_rooms) : [],
      package_addon: entity.package_addon,
      available_packages: entity.available_packages ? JSON.parse(entity.available_packages) : [],
    }
  }
}
