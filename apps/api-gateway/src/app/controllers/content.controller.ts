import { Controller, Get, Query, Param } from "@nestjs/common"
import type { ClientProxy } from "@nestjs/microservices"
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger"
import type { Venue, Room, Addon } from "@booking-journey/shared/types"

@ApiTags("Content")
@Controller("api")
export class ContentController {
  private readonly contentService: ClientProxy

  constructor(contentService: ClientProxy) {
    this.contentService = contentService
  }

  @Get("venues/:id")
  @ApiOperation({ summary: "Get venue details" })
  @ApiParam({ name: "id", description: "Venue ID" })
  @ApiQuery({ name: "lang", required: false, description: "Language code" })
  @ApiResponse({ status: 200, description: "Venue details" })
  async getVenueDetails(@Param('id') id: number, @Query('lang') lang?: string): Promise<Venue> {
    return this.contentService.send("content.venue.details", { id, lang }).toPromise()
  }

  @Get("venues/:id/addons")
  @ApiOperation({ summary: "Get venue addons" })
  @ApiParam({ name: "id", description: "Venue ID" })
  @ApiQuery({ name: "delegates", required: false, description: "Number of delegates" })
  @ApiQuery({ name: "start_date", required: false, description: "Start date" })
  @ApiQuery({ name: "start_time", required: false, description: "Start time" })
  @ApiQuery({ name: "duration", required: false, description: "Duration in hours" })
  @ApiResponse({ status: 200, description: "Available addons" })
  async getVenueAddons(@Param('id') id: number, @Query() params: any): Promise<Addon[]> {
    return this.contentService.send("content.venue.addons", { id, ...params }).toPromise()
  }

  @Get("rooms/:id")
  @ApiOperation({ summary: "Get room details" })
  @ApiParam({ name: "id", description: "Room ID" })
  @ApiQuery({ name: "lang", required: false, description: "Language code" })
  @ApiResponse({ status: 200, description: "Room details" })
  async getRoomDetails(@Param('id') id: number, @Query('lang') lang?: string): Promise<Room> {
    return this.contentService.send("content.room.details", { id, lang }).toPromise()
  }
}
