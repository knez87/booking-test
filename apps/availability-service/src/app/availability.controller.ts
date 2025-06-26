import { Controller } from "@nestjs/common"
import { MessagePattern } from "@nestjs/microservices"
import type { AvailabilityService } from "./availability.service"
import type {
  AvailabilitySearchParams,
  RoomAvailabilityParams,
  Venue,
  AvailableRoom,
  AvailablePackage,
  PaginatedResponse,
} from "@booking-journey/shared/types"

@Controller()
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @MessagePattern("availability.venues")
  async getVenuesAvailability(params: AvailabilitySearchParams): Promise<PaginatedResponse<Venue>> {
    return this.availabilityService.getVenuesAvailability(params)
  }

  @MessagePattern("availability.venue.rooms")
  async getVenueAvailability(data: { id: number } & RoomAvailabilityParams): Promise<AvailableRoom[]> {
    return this.availabilityService.getVenueRoomAvailability(data.id, data)
  }

  @MessagePattern("availability.venue.packages")
  async getVenuePackageAvailability(data: { id: number } & RoomAvailabilityParams): Promise<AvailablePackage[]> {
    return this.availabilityService.getVenuePackageAvailability(data.id, data)
  }

  @MessagePattern("availability.venue.day")
  async getDayAvailability(data: { id: number; date: string }): Promise<{ id: number; availability: string }[]> {
    return this.availabilityService.getDayAvailability(data.id, data.date)
  }

  @MessagePattern("availability.meetingroom")
  async getMeetingRoomAvailability(data: any): Promise<AvailableRoom> {
    return this.availabilityService.getMeetingRoomAvailability(data.id, data)
  }

  @MessagePattern("availability.package")
  async getPackageAvailability(data: any): Promise<AvailablePackage> {
    return this.availabilityService.getPackageAvailability(data.id, data)
  }
}
