import { Controller } from "@nestjs/common"
import { MessagePattern } from "@nestjs/microservices"
import type { SearchService } from "./search.service"
import type { VenueSearchParams, Venue, PaginatedResponse } from "@booking-journey/shared/types"

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @MessagePattern("search.venues")
  async searchVenues(params: VenueSearchParams): Promise<PaginatedResponse<Venue>> {
    return this.searchService.searchVenues(params)
  }
}
