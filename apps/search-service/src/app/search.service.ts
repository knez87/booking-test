import { Injectable } from "@nestjs/common"
import { prisma } from "@booking-journey/shared/database"
import type { VenueSearchParams, Venue, PaginatedResponse } from "@booking-journey/shared/types"

@Injectable()
export class SearchService {
  async searchVenues(params: VenueSearchParams): Promise<PaginatedResponse<Venue>> {
    const { lat, lng, radius = 5000, limit = 20, offset = 0, delegates } = params

    const latitude = Number.parseFloat(lat)
    const longitude = Number.parseFloat(lng)

    // Use Prisma's raw query for geospatial search with Haversine formula
    const venues = await prisma.$queryRaw<any[]>`
      SELECT 
        v.*,
        (6371 * acos(
          cos(radians(${latitude})) * 
          cos(radians(CAST(v.latitude AS FLOAT))) * 
          cos(radians(CAST(v.longitude AS FLOAT)) - radians(${longitude})) + 
          sin(radians(${latitude})) * 
          sin(radians(CAST(v.latitude AS FLOAT)))
        )) * 1000 AS distance
      FROM venues v
      WHERE 
        (${delegates}::int IS NULL OR v.max_delegates >= ${delegates}::int)
        AND (6371 * acos(
          cos(radians(${latitude})) * 
          cos(radians(CAST(v.latitude AS FLOAT))) * 
          cos(radians(CAST(v.longitude AS FLOAT)) - radians(${longitude})) + 
          sin(radians(${latitude})) * 
          sin(radians(CAST(v.latitude AS FLOAT)))
        )) * 1000 <= ${radius}
      ORDER BY distance ASC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    // Get total count for pagination
    const totalCount = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM venues v
      WHERE 
        (${delegates}::int IS NULL OR v.max_delegates >= ${delegates}::int)
        AND (6371 * acos(
          cos(radians(${latitude})) * 
          cos(radians(CAST(v.latitude AS FLOAT))) * 
          cos(radians(CAST(v.longitude AS FLOAT)) - radians(${longitude})) + 
          sin(radians(${latitude})) * 
          sin(radians(CAST(v.latitude AS FLOAT)))
        )) * 1000 <= ${radius}
    `

    const total = Number(totalCount[0].count)

    return {
      items: venues.map(this.mapVenueToResponse),
      results: venues.length,
      total_results: total,
      offset,
      limit,
    }
  }

  async searchVenuesByText(query: string, limit = 20, offset = 0): Promise<PaginatedResponse<Venue>> {
    const venues = await prisma.venue.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { summary: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { country: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      skip: offset,
      orderBy: { name: "asc" },
    })

    const total = await prisma.venue.count({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { summary: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { country: { contains: query, mode: "insensitive" } },
        ],
      },
    })

    return {
      items: venues.map(this.mapVenueToResponse),
      results: venues.length,
      total_results: total,
      offset,
      limit,
    }
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
      images: venue.images || [],
      currency: venue.currency,
      max_delegates: venue.max_delegates,
      starting_price_cents: venue.starting_price_cents,
    }
  }
}
