"use client"

import { useState } from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"
import { useBooking } from "../contexts/BookingContext"
import { getVenuesAvailability } from "../services/api"
import type { AvailabilitySearchParams } from "@booking-journey/shared/types"
import { MapPin, Users, Clock, Calendar, Search, Filter } from "lucide-react"

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

  const [showFilters, setShowFilters] = useState(false)

  const {
    data: venuesData,
    isLoading,
    error,
    refetch,
  } = useQuery(["venues-availability", searchParams], () => getVenuesAvailability(searchParams), {
    enabled: false,
  })

  const handleSearch = () => {
    dispatch({ type: "SET_SEARCH_PARAMS", payload: searchParams })
    dispatch({ type: "SET_CURRENT_STEP", payload: 1 })
    refetch()
  }

  const handleVenueSelect = (venue: any) => {
    dispatch({ type: "SET_SELECTED_VENUE", payload: venue })
    dispatch({ type: "SET_CURRENT_STEP", payload: 2 })
    navigate(`/venue/${venue.id}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Find Your Perfect Meeting Venue</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Search and book meeting rooms, conference facilities, and event packages worldwide. From intimate boardrooms
          to large conference centers.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Location */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <MapPin className="inline w-4 h-4 mr-1" />
              Location
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={searchParams.lat}
                onChange={(e) => setSearchParams({ ...searchParams, lat: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Latitude"
              />
              <input
                type="text"
                value={searchParams.lng}
                onChange={(e) => setSearchParams({ ...searchParams, lng: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Longitude"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Calendar className="inline w-4 h-4 mr-1" />
              Date
            </label>
            <input
              type="date"
              value={searchParams.start_date}
              onChange={(e) => setSearchParams({ ...searchParams, start_date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Time & Duration */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Clock className="inline w-4 h-4 mr-1" />
              Time & Duration
            </label>
            <div className="space-y-2">
              <input
                type="time"
                value={searchParams.start_time}
                onChange={(e) => setSearchParams({ ...searchParams, start_time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={searchParams.duration}
                onChange={(e) => setSearchParams({ ...searchParams, duration: Number.parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 hour</option>
                <option value={2}>2 hours</option>
                <option value={4}>4 hours</option>
                <option value={8}>Full day</option>
              </select>
            </div>
          </div>

          {/* Delegates */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Users className="inline w-4 h-4 mr-1" />
              Delegates
            </label>
            <input
              type="number"
              value={searchParams.delegates}
              onChange={(e) => setSearchParams({ ...searchParams, delegates: Number.parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="1000"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Radius</label>
              <select
                value={searchParams.radius}
                onChange={(e) => setSearchParams({ ...searchParams, radius: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1000}>1 km</option>
                <option value={5000}>5 km</option>
                <option value={10000}>10 km</option>
                <option value={25000}>25 km</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Results Limit</label>
              <select
                value={searchParams.limit}
                onChange={(e) => setSearchParams({ ...searchParams, limit: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10 results</option>
                <option value={20}>20 results</option>
                <option value={50}>50 results</option>
              </select>
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className="text-center">
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-blue-600 text-white px-12 py-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-semibold text-lg transition-colors flex items-center mx-auto"
          >
            <Search className="w-5 h-5 mr-2" />
            {isLoading ? "Searching..." : "Search Venues"}
          </button>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="text-red-400 mr-3">⚠️</div>
            <div>
              <h3 className="text-red-800 font-medium">Search Error</h3>
              <p className="text-red-700">Unable to load venues. Please check your search parameters and try again.</p>
            </div>
          </div>
        </div>
      )}

      {venuesData && (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{venuesData.total_results} venues found</h2>
            <div className="text-sm text-gray-600">
              Showing {venuesData.items.length} of {venuesData.total_results} results
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venuesData.items.map((venue) => (
              <div
                key={venue.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                onClick={() => handleVenueSelect(venue)}
              >
                {venue.images && venue.images.length > 0 ? (
                  <img
                    src={venue.images[0].url || "/placeholder.svg"}
                    alt={venue.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-blue-400" />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {venue.name}
                  </h3>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {venue.address.city}, {venue.address.country}
                    </span>
                  </div>

                  {venue.summary && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">{venue.summary}</p>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      Up to {venue.max_delegates} delegates
                    </div>
                    {venue.starting_price_cents && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          €{(venue.starting_price_cents / 100).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500">from</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {venuesData && venuesData.items.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No venues found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or expanding your search radius.</p>
          <button onClick={() => setShowFilters(true)} className="text-blue-600 hover:text-blue-700 font-medium">
            Modify Search Filters
          </button>
        </div>
      )}
    </div>
  )
}
