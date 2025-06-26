import { Controller } from "@nestjs/common"
import { MessagePattern } from "@nestjs/microservices"
import type { ContentService } from "./content.service"
import type { Venue, Room, Addon } from "@booking-journey/shared/types"

@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @MessagePattern("content.venue.details")
  async getVenueDetails(data: { id: number; lang?: string }): Promise<Venue> {
    return this.contentService.getVenueDetails(data.id, data.lang)
  }

  @MessagePattern("content.venue.addons")
  async getVenueAddons(data: any): Promise<Addon[]> {
    return this.contentService.getVenueAddons(data.id, data)
  }

  @MessagePattern("content.room.details")
  async getRoomDetails(data: { id: number; lang?: string }): Promise<Room> {
    return this.contentService.getRoomDetails(data.id, data.lang)
  }
}
