import { Controller, Get, Query, Param } from "@nestjs/common"
import type { ClientProxy } from "@nestjs/microservices"
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger"
import type {
  AvailabilitySearchParams,
  RoomAvailabilityParams,
  Venue,
  AvailableRoom,
  AvailablePackage,
  PaginatedResponse,
} from "@booking-journey/shared/types"

const AVAILABILITY_SERVICE = "AVAILABILITY_SERVICE"

@ApiTags("Availability")
@Controller("api/availability")
export class AvailabilityController {
  private readonly availabilityService: ClientProxy

  constructor(availabilityService: ClientProxy) {
    this.availabilityService = availabilityService
  }

  @Get('venues')
  @ApiOperation({ summary: 'Get venues availability' })
  @ApiResponse({ status: 200, description: 'Available venues list' })
  async getVenuesAvailability(@Query() params: AvailabilitySearchParams): Promise<PaginatedResponse<Venue>> {
    return this.availabilityService.send('availability.venues', params).toPromise();
  }

  @Get("venues/:id")
  @ApiOperation({ summary: "Get venue room availability" })
  @ApiParam({ name: "id", description: "Venue ID" })
  @ApiResponse({ status: 200, description: "Available rooms for venue" })
  async getVenueAvailability(
    @Param('id') id: number,
    @Query() params: RoomAvailabilityParams,
  ): Promise<AvailableRoom[]> {
    return this.availabilityService.send("availability.venue.rooms", { id, ...params }).toPromise()
  }

  @Get("venues/:id/packages")
  @ApiOperation({ summary: "Get venue package availability" })
  @ApiParam({ name: "id", description: "Venue ID" })
  @ApiResponse({ status: 200, description: "Available packages for venue" })
  async getVenuePackageAvailability(
    @Param('id') id: number,
    @Query() params: RoomAvailabilityParams,
  ): Promise<AvailablePackage[]> {
    return this.availabilityService.send("availability.venue.packages", { id, ...params }).toPromise()
  }

  @Get("venues/:id/day")
  @ApiOperation({ summary: "Get day venue availability" })
  @ApiParam({ name: "id", description: "Venue ID" })
  @ApiQuery({ name: "date", description: "Date in YYYY-MM-DD format" })
  @ApiResponse({ status: 200, description: "Day availability for all rooms" })
  async getDayAvailability(
    @Param('id') id: number,
    @Query('date') date: string,
  ): Promise<{ id: number; availability: string }[]> {
    return this.availabilityService.send("availability.venue.day", { id, date }).toPromise()
  }

  @Get("meetingrooms/:id")
  @ApiOperation({ summary: "Get meeting room availability" })
  @ApiParam({ name: "id", description: "Room ID" })
  @ApiResponse({ status: 200, description: "Room availability" })
  async getMeetingRoomAvailability(@Param('id') id: number, @Query() params: any): Promise<AvailableRoom> {
    return this.availabilityService.send("availability.meetingroom", { id, ...params }).toPromise()
  }

  @Get("packages/:id")
  @ApiOperation({ summary: "Get package availability" })
  @ApiParam({ name: "id", description: "Package ID" })
  @ApiResponse({ status: 200, description: "Package availability" })
  async getPackageAvailability(
    @Param('id') id: number,
    @Query() params: RoomAvailabilityParams,
  ): Promise<AvailablePackage> {
    return this.availabilityService.send("availability.package", { id, ...params }).toPromise()
  }
}
</merged_code>
