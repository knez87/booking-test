"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "react-query"
import { useBooking } from "../contexts/BookingContext"
import { getVenueDetails, getVenueAvailability, getVenuePackageAvailability } from "../services/api"
import { MapPin, Users, Coffee, Star, ArrowLeft } from "lucide-react"

export function VenueDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state, dispatch } = useBooking()

  const [activeTab, setActiveTab] = useState<"rooms" | "packages">("rooms")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const venueId = Number.parseInt(id!)

  // Get venue details
  const { data: venue, isLoading: venueLoading } = useQuery(["venue", venueId], () => getVenueDetails(venueId), {
    enabled: !!venueId,
  })

  // Get room availability
  const { data: availableRooms, isLoading: roomsLoading } = useQuery(
    ["venue-rooms", venueId, state.searchParams],
    () =>
      getVenueAvailability(venueId, {
        delegates: state.searchParams!.delegates,
        start_date: state.searchParams!.start_date,
        start_time: state.searchParams!.start_time,
        duration: state.searchParams!.duration,
      }),
    { enabled: !!venueId && !!state.searchParams },
  )

  // Get package availability
  const { data: availablePackages, isLoading: packagesLoading } = useQuery(
    ["venue-packages", venueId, state.searchParams],
    () =>
      getVenuePackageAvailability(venueId, {
        delegates: state.searchParams!.delegates,
        start_date: state.searchParams!.start_date,
        start_time: state.searchParams!.start_time,
        duration: state.searchParams!.duration,
      }),
    { enabled: !!venueId && !!state.searchParams },
  )

  const handleRoomSelect = (room: any) => {
    dispatch({ type: "SET_SELECTED_ROOM", payload: room })
    dispatch({ type: "SET_CURRENT_STEP", payload: 3 })
    navigate("/booking")
  }

  const handlePackageSelect = (pkg: any) => {
    dispatch({ type: "SET_SELECTED_PACKAGE", payload: pkg })
    dispatch({ type: "SET_CURRENT_STEP", payload: 3 })
    navigate("/booking")
  }

  if (venueLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Venue not found</h2>
          <button onClick={() => navigate("/")} className="mt-4 text-blue-600 hover:text-blue-700">
            Back to search
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to search results
      </button>

      {/* Venue Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        {/* Image Gallery */}
        {venue.images && venue.images.length > 0 && (
          <div className="relative">
            <img
              src={venue.images[selectedImageIndex]?.url || "/placeholder.svg"}
              alt={venue.name}
              className="w-full h-96 object-cover"
            />
            {venue.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {venue.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${index === selectedImageIndex ? "bg-white" : "bg-white/50"}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{venue.name}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>
                  {venue.address.street}, {venue.address.city}, {venue.address.country}
                </span>
              </div>
              {venue.summary && <p className="text-gray-700 text-lg leading-relaxed max-w-3xl">{venue.summary}</p>}
            </div>
            <div className="text-right">
              <div className="flex items-center mb-2">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-semibold">4.8</span>
                <span className="text-gray-500 ml-1">(124 reviews)</span>
              </div>
              {venue.starting_price_cents && (
                <div>
                  <span className="text-3xl font-bold text-blue-600">
                    €{(venue.starting_price_cents / 100).toFixed(0)}
                  </span>
                  <span className="text-gray-500 ml-1">from</span>
                </div>
              )}
            </div>
          </div>

          {/* Facilities */}
          {venue.facilities && venue.facilities.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Facilities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {venue.facilities.slice(0, 8).map((facility) => (
                  <div key={facility.id} className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-sm">{facility.facility_description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Availability Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Options</h2>
          <div className="text-sm text-gray-600">
            {state.searchParams && (
              <>
                {new Date(state.searchParams.start_date).toLocaleDateString()} •{state.searchParams.start_time} •
                {state.searchParams.duration}h •{state.searchParams.delegates} delegates
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("rooms")}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === "rooms" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Meeting Rooms ({availableRooms?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("packages")}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === "packages" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Packages ({availablePackages?.length || 0})
          </button>
        </div>

        {/* Rooms Tab */}
        {activeTab === "rooms" && (
          <div className="space-y-6">
            {roomsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading available rooms...</p>
              </div>
            ) : availableRooms && availableRooms.length > 0 ? (
              availableRooms.map((room) => (
                <div
                  key={room.id}
                  className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.name}</h3>
                      {room.description && <p className="text-gray-600 mb-3">{room.description}</p>}
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {room.min_delegates}-{room.max_delegates} people
                        </div>
                        {room.dimensions?.area && (
                          <div className="flex items-center">
                            <span>{room.dimensions.area} m²</span>
                          </div>
                        )}
                        {room.instant_bookable && (
                          <div className="flex items-center text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            Instant booking
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        €{(room.amount_inc_tax / 100).toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-500 mb-4">inc. tax</div>
                      <button
                        onClick={() => handleRoomSelect(room)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Select Room
                      </button>
                    </div>
                  </div>

                  {/* Room Equipment */}
                  {room.equipments && room.equipments.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Equipment Included</h4>
                      <div className="flex flex-wrap gap-2">
                        {room.equipments.slice(0, 6).map((equipment) => (
                          <span
                            key={equipment.id}
                            className={`px-3 py-1 rounded-full text-xs ${
                              equipment.free ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {equipment.description}
                            {!equipment.free && " (extra charge)"}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms available</h3>
                <p className="text-gray-600">No meeting rooms match your criteria for the selected date and time.</p>
              </div>
            )}
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === "packages" && (
          <div className="space-y-6">
            {packagesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading available packages...</p>
              </div>
            ) : availablePackages && availablePackages.length > 0 ? (
              availablePackages.map((pkg) => (
                <div
                  key={pkg.availability_id}
                  className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.name}</h3>
                      {pkg.info && <p className="text-gray-600 mb-3">{pkg.info}</p>}
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {pkg.min_delegates}-{pkg.max_delegates} people
                        </div>
                        <div className="flex items-center">
                          <span>
                            {pkg.rooms.length} room{pkg.rooms.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        €{(pkg.amount_inc_tax / 100).toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-500 mb-4">inc. tax</div>
                      <button
                        onClick={() => handlePackageSelect(pkg)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Select Package
                      </button>
                    </div>
                  </div>

                  {/* Package Includes */}
                  {pkg.includes && pkg.includes.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Package Includes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {pkg.includes.map((include) => (
                          <div key={include.id} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            {include.description}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Coffee className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No packages available</h3>
                <p className="text-gray-600">No meeting packages match your criteria for the selected date and time.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
