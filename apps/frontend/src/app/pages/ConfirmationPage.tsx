"use client"

import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "react-query"
import { useBooking } from "../contexts/BookingContext"
import { getOrderDetails } from "../services/api"
import { CheckCircle, Calendar, Clock, Users, MapPin, Mail, Phone, Download, Share } from "lucide-react"

export function ConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { state, dispatch } = useBooking()

  const { data: orderDetails, isLoading } = useQuery(["order", orderId], () => getOrderDetails(orderId!), {
    enabled: !!orderId,
  })

  useEffect(() => {
    if (orderDetails) {
      dispatch({ type: "SET_ORDER_DETAILS", payload: orderDetails })
    }
  }, [orderDetails, dispatch])

  const handleNewBooking = () => {
    dispatch({ type: "RESET" })
    navigate("/")
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking confirmation...</p>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Booking not found</h2>
          <button onClick={() => navigate("/")} className="mt-4 text-blue-600 hover:text-blue-700">
            Back to search
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-lg text-gray-600">
          Your meeting room has been successfully booked. You'll receive a confirmation email shortly.
        </p>
      </div>

      {/* Booking Details */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-1">Booking Reference</h2>
              <p className="text-blue-100 text-lg font-mono">{orderDetails.id}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Status</p>
              <p className="text-lg font-semibold capitalize">{orderDetails.status}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Event Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(orderDetails.start).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(orderDetails.start).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(orderDetails.end).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-3" />
                  <p className="font-medium text-gray-900">{orderDetails.delegates} delegates</p>
                </div>
                {orderDetails.host_name && (
                  <div className="flex items-center text-gray-600">
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                    <p className="font-medium text-gray-900">Host: {orderDetails.host_name}</p>
                  </div>
                )}
                {orderDetails.event_name && (
                  <div className="flex items-center text-gray-600">
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                    <p className="font-medium text-gray-900">Event: {orderDetails.event_name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Venue & Room Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Venue & Room</h3>
              <div className="space-y-3">
                <div className="flex items-start text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{state.selectedVenue?.name}</p>
                    <p className="text-sm">
                      {state.selectedVenue?.address.street}
                      <br />
                      {state.selectedVenue?.address.city}, {state.selectedVenue?.address.country}
                    </p>
                  </div>
                </div>
                {orderDetails.rooms && orderDetails.rooms.length > 0 && (
                  <div className="pl-8">
                    <h4 className="font-medium text-gray-900 mb-2">Rooms:</h4>
                    {orderDetails.rooms.map((room, index) => (
                      <div key={index} className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">{room.name}</span>
                        {room.layout && <span className="ml-2">({room.layout} setup)</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          {state.customer && (
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{state.customer.email}</p>
                    <p className="text-sm">Confirmation sent to this email</p>
                  </div>
                </div>
                {state.customer.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3" />
                    <p className="font-medium text-gray-900">{state.customer.phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          {orderDetails.items && orderDetails.items.length > 0 && (
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} {item.unit} × €{(item.unit_price_inc_tax / 100).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">€{(item.amount_inc_tax / 100).toFixed(2)}</p>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">€{(orderDetails.amount_inc_tax / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Confirmation
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "Meeting Room Booking Confirmation",
                text: `Booking confirmed for ${orderDetails.host_name || "your meeting"}`,
                url: window.location.href,
              })
            }
          }}
          className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
        >
          <Share className="w-5 h-5 mr-2" />
          Share Booking
        </button>
        <button
          onClick={handleNewBooking}
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Make Another Booking
        </button>
      </div>

      {/* Important Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
        <h3 className="font-semibold text-yellow-800 mb-2">Important Information</h3>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Please arrive 15 minutes before your scheduled time</li>
          <li>• Bring a valid ID for venue access</li>
          <li>• Contact the venue directly for any special requirements</li>
          <li>• Cancellation policy applies as per terms and conditions</li>
        </ul>
      </div>
    </div>
  )
}
