"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "react-query"
import { useBooking } from "../contexts/BookingContext"
import { getVenueAddons, createCustomer, createOrder } from "../services/api"
import { ArrowLeft, Plus, Minus, Users, Clock, Calendar, MapPin, CreditCard } from "lucide-react"
import type { NewCustomer, OrderRequest } from "@booking-journey/shared/types"

export function BookingPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useBooking()

  const [selectedAddons, setSelectedAddons] = useState<any[]>([])
  const [customer, setCustomer] = useState<NewCustomer>({
    first_name: "",
    last_name: "",
    email: "",
    company: "",
    phone: "",
    billing_address: {
      street: "",
      postal_code: "",
      city: "",
      country: "",
      country_code: "",
      state: "",
      cost_center: "",
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState<"addons" | "details" | "payment">("addons")

  const selectedItem = state.selectedRoom || state.selectedPackage
  const venue = state.selectedVenue

  // Get available addons
  const { data: addons, isLoading: addonsLoading } = useQuery(
    ["venue-addons", venue?.id, state.searchParams],
    () =>
      getVenueAddons(venue!.id, {
        delegates: state.searchParams!.delegates,
        start_date: state.searchParams!.start_date,
        start_time: state.searchParams!.start_time,
        duration: state.searchParams!.duration,
      }),
    { enabled: !!venue?.id && !!state.searchParams },
  )

  const handleAddonChange = (addon: any, quantity: number) => {
    setSelectedAddons((prev) => {
      const existing = prev.find((a) => a.id === addon.id)
      if (quantity === 0) {
        return prev.filter((a) => a.id !== addon.id)
      }
      if (existing) {
        return prev.map((a) => (a.id === addon.id ? { ...a, quantity } : a))
      }
      return [...prev, { ...addon, quantity }]
    })
  }

  const calculateTotal = () => {
    const basePrice = selectedItem?.amount_inc_tax || 0
    const addonsPrice = selectedAddons.reduce((sum, addon) => sum + addon.amount_inc_tax * addon.quantity, 0)
    return basePrice + addonsPrice
  }

  const handleSubmit = async () => {
    if (currentStep === "addons") {
      dispatch({ type: "SET_SELECTED_ADDONS", payload: selectedAddons })
      setCurrentStep("details")
      return
    }

    if (currentStep === "details") {
      setCurrentStep("payment")
      return
    }

    // Final submission
    setIsSubmitting(true)
    try {
      // Create customer
      const createdCustomer = await createCustomer(customer)
      dispatch({ type: "SET_CUSTOMER", payload: createdCustomer })

      // Create order
      const orderRequest: OrderRequest = {
        availability_id: selectedItem!.availability_id,
        customer_id: createdCustomer.id,
        room_id: state.selectedRoom?.id,
        additional_notes: "",
        host_name: customer.first_name + " " + customer.last_name,
        event_name: "Meeting",
        addons: selectedAddons.map((addon) => ({
          id: addon.id,
          quantity: addon.quantity,
        })),
      }

      const order = await createOrder(orderRequest)
      dispatch({ type: "SET_ORDER_DETAILS", payload: order })
      dispatch({ type: "SET_CURRENT_STEP", payload: 6 })

      navigate(`/confirmation/${order.id}`)
    } catch (error) {
      console.error("Booking failed:", error)
      alert("Booking failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedItem || !venue) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No selection found</h2>
          <button onClick={() => navigate("/")} className="mt-4 text-blue-600 hover:text-blue-700">
            Back to search
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/venue/${venue.id}`)}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to venue details
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step Indicator */}
          <div className="flex items-center mb-8">
            {["addons", "details", "payment"].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep === step
                      ? "bg-blue-600 text-white"
                      : index < ["addons", "details", "payment"].indexOf(currentStep)
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index < ["addons", "details", "payment"].indexOf(currentStep) ? "✓" : index + 1}
                </div>
                <span
                  className={`ml-2 text-sm capitalize ${
                    currentStep === step ? "text-gray-900 font-medium" : "text-gray-500"
                  }`}
                >
                  {step === "addons" ? "Add Services" : step === "details" ? "Your Details" : "Payment"}
                </span>
                {index < 2 && (
                  <div
                    className={`w-12 h-0.5 mx-4 ${
                      index < ["addons", "details", "payment"].indexOf(currentStep) ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Addons Step */}
          {currentStep === "addons" && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Extra Services</h2>

              {addonsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading available services...</p>
                </div>
              ) : addons && addons.length > 0 ? (
                <div className="space-y-4">
                  {addons.map((addon) => {
                    const selectedAddon = selectedAddons.find((a) => a.id === addon.id)
                    const quantity = selectedAddon?.quantity || 0

                    return (
                      <div key={addon.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{addon.description}</h3>
                            <p className="text-sm text-gray-600 mb-2">Category: {addon.category}</p>
                            <div className="text-lg font-bold text-blue-600">
                              €{(addon.amount_inc_tax / 100).toFixed(2)} per {addon.unit}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 ml-6">
                            <button
                              onClick={() => handleAddonChange(addon, Math.max(0, quantity - 1))}
                              disabled={quantity === 0}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{quantity}</span>
                            <button
                              onClick={() => handleAddonChange(addon, quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No additional services available for this booking.</p>
                </div>
              )}
            </div>
          )}

          {/* Customer Details Step */}
          {currentStep === "details" && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={customer.first_name}
                    onChange={(e) => setCustomer({ ...customer, first_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={customer.last_name}
                    onChange={(e) => setCustomer({ ...customer, last_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={customer.company}
                    onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      value={customer.billing_address?.street}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          billing_address: { ...customer.billing_address!, street: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={customer.billing_address?.city}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          billing_address: { ...customer.billing_address!, city: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={customer.billing_address?.postal_code}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          billing_address: { ...customer.billing_address!, postal_code: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={customer.billing_address?.country}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          billing_address: { ...customer.billing_address!, country: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country Code</label>
                    <input
                      type="text"
                      value={customer.billing_address?.country_code}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          billing_address: { ...customer.billing_address!, country_code: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="US, GB, DE, etc."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {currentStep === "payment" && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-blue-800 font-medium">Secure Payment</span>
                </div>
                <p className="text-blue-700 text-sm mt-1">Your payment information is encrypted and secure.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    value={`${customer.first_name} ${customer.last_name}`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => {
                if (currentStep === "addons") {
                  navigate(`/venue/${venue.id}`)
                } else if (currentStep === "details") {
                  setCurrentStep("addons")
                } else {
                  setCurrentStep("details")
                }
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : currentStep === "payment" ? "Complete Booking" : "Continue"}
            </button>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>

            {/* Venue Info */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">{venue.name}</h4>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                {venue.address.city}, {venue.address.country}
              </div>
            </div>

            {/* Selected Item */}
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedItem.name}</h4>
                  <div className="text-sm text-gray-600 space-y-1 mt-1">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {state.searchParams && new Date(state.searchParams.start_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {state.searchParams?.start_time} ({state.searchParams?.duration}h)
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {state.searchParams?.delegates} delegates
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">€{(selectedItem.amount_inc_tax / 100).toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Selected Addons */}
            {selectedAddons.length > 0 && (
              <div className="border-t pt-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Additional Services</h4>
                {selectedAddons.map((addon) => (
                  <div key={addon.id} className="flex justify-between items-center text-sm mb-2">
                    <div>
                      <span className="text-gray-900">{addon.description}</span>
                      <span className="text-gray-500 ml-1">x{addon.quantity}</span>
                    </div>
                    <span className="font-medium">€{((addon.amount_inc_tax * addon.quantity) / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">€{(calculateTotal() / 100).toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Includes all taxes and fees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
