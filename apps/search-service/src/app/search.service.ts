import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { VenueEntity } from "./entities/venue.entity"
import type { VenueSearchParams, Venue, PaginatedResponse } from "@booking-journey/shared/types"

@Injectable()
export class SearchService {
  constructor(private readonly venueRepository: Repository<VenueEntity>) {}

  async searchVenues(params: VenueSearchParams): Promise<PaginatedResponse<Venue>> {
    const { lat, lng, radius = 5000, limit = 20, offset = 0 } = params

    // Convert lat/lng to numbers for calculation
    const latitude = Number.parseFloat(lat)
    const longitude = Number.parseFloat(lng)

    // Using Haversine formula for distance calculation
    const query = this.venueRepository
      .createQueryBuilder("venue")
      .select([
        "venue.*",
        `(6371 * acos(cos(radians(${latitude})) * cos(radians(venue.latitude)) * cos(radians(venue.longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(venue.latitude)))) * 1000 AS distance`,
      ])
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
      latitude: entity.venue_latitude,
      longitude: entity.venue_longitude,
      summary: entity.venue_summary,
      images: entity.venue_images ? JSON.parse(entity.venue_images) : [],
      currency: entity.venue_currency,
      max_delegates: entity.venue_max_delegates,
      starting_price_cents: entity.venue_starting_price_cents,
    }
  }
}
