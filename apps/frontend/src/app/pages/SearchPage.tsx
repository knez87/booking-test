"use client"

import { useState } from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"
import { useBooking } from "../contexts/BookingContext"
import { getVenuesAvailability } from "../services/api"
import type { AvailabilitySearchParams } from "@booking-journey/shared/types"

export function SearchPage() {
  const navigate = useNavigate()
  const { dispatch } = useBooking()

  const [searchParams, setSearchParams] = useState<AvailabilitySearchParams>({
    lat: "60.1699",
    lng: "24.9384",
    delegates: 10,
    start_date: new Date().toISOString().split("T")[0],
    start_time: "09:00",
    duration: 4,
    radius: 5000,
    limit: 20,
  })

  const {
    data: venuesData,
    isLoading,
    error,
  } = useQuery(["venues-availability", searchParams], () => getVenuesAvailability(searchParams), {
    enabled: false, // Only run when user searches
  })

  const handleSearch = () => {
    dispatch({ type: "SET_SEARCH_PARAMS", payload: searchParams })
  }

  const handleVenueSelect = (venue: any) => {
    dispatch({ type: "SET_SELECTED_VENUE", payload: venue })
    navigate(`/venue/${venue.id}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Meeting Venue</h1>
        <p className="text-xl text-gray-600">Search and book meeting rooms and event packages worldwide</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location (Latitude)</label>
            <input
              type="text"
              value={searchParams.lat}
              onChange={(e) => setSearchParams({ ...searchParams, lat: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="60.1699"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location (Longitude)</label>
            <input
              type="text"
              value={searchParams.lng}
              onChange={(e) => setSearchParams({ ...searchParams, lng: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="24.9384"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delegates</label>
            <input
              type="number"
              value={searchParams.delegates}
              onChange={(e) => setSearchParams({ ...searchParams, delegates: Number.parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={searchParams.start_date}
              onChange={(e) => setSearchParams({ ...searchParams, start_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <input
              type="time"
              value={searchParams.start_time}
              onChange={(e) => setSearchParams({ ...searchParams, start_time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
            <input
              type="number"
              value={searchParams.duration}
              onChange={(e) => setSearchParams({ ...searchParams, duration: Number.parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Radius (meters)</label>
            <select
              value={searchParams.radius}
              onChange={(e) => setSearchParams({ ...searchParams, radius: Number.parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1000}>1 km</option>
              <option value={5000}>5 km</option>
              <option value={10000}>10 km</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Searching..." : "Search Venues"}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">Error loading venues. Please try again.</p>
        </div>
      )}

      {venuesData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venuesData.items.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleVenueSelect(venue)}
            >
              {venue.images && venue.images.length > 0 && (
                <img
                  src={venue.images[0].url || "/placeholder.svg"}
                  alt={venue.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{venue.name}</h3>
                <p className="text-gray-600 mb-2">
                  {venue.address.city}, {venue.address.country}
                </p>
                {venue.summary && <p className="text-gray-700 text-sm mb-4 line-clamp-3">{venue.summary}</p>}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Up to {venue.max_delegates} delegates</span>
                  {venue.starting_price_cents && (
                    <span className="text-lg font-semibold text-blue-600">
                      From €{(venue.starting_price_cents / 100).toFixed(0)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {venuesData && venuesData.items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No venues found matching your criteria. Try adjusting your search parameters.
          </p>
        </div>
      )}
    </div>
  )
}
