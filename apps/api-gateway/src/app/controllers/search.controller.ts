import { Controller, Get, Query } from "@nestjs/common"
import type { ClientProxy } from "@nestjs/microservices"
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger"
import type { VenueSearchParams, Venue, PaginatedResponse } from "@booking-journey/shared/types"

@ApiTags("Search")
@Controller("api/venues")
export class SearchController {
  private readonly searchService: ClientProxy

  constructor(searchService: ClientProxy) {
    this.searchService = searchService
  }

  @Get()
  @ApiOperation({ summary: 'Search venues with coordinates' })
  @ApiQuery({ name: 'lat', description: 'Latitude of the searched city' })
  @ApiQuery({ name: 'lng', description: 'Longitude of the searched city' })
  @ApiQuery({ name: 'radius', required: false, description: 'Search radius in meters' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit results per page' })
  @ApiQuery({ name: 'offset', required: false, description: 'Number of results to skip' })
  @ApiResponse({ status: 200, description: 'Successful venue search' })
  async searchVenues(@Query() params: VenueSearchParams): Promise<PaginatedResponse<Venue>> {
    return this.searchService.send('search.venues', params).toPromise();
  }
}
