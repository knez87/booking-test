"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode, useEffect } from "react"
import type { AvailabilitySearchParams } from "@booking-journey/shared/types"

// Define the state types
interface BookingState {
  currentStep: number
  searchParams: AvailabilitySearchParams | null
  selectedVenue: any | null
  selectedRoom: any | null
  selectedPackage: any | null
  selectedAddons: any[]
  customer: any | null
  orderDetails: any | null
}

// Define the action types
type BookingAction =
  | { type: "SET_CURRENT_STEP"; payload: number }
  | { type: "SET_SEARCH_PARAMS"; payload: AvailabilitySearchParams }
  | { type: "SET_SELECTED_VENUE"; payload: any }
  | { type: "SET_SELECTED_ROOM"; payload: any }
  | { type: "SET_SELECTED_PACKAGE"; payload: any }
  | { type: "SET_SELECTED_ADDONS"; payload: any[] }
  | { type: "SET_CUSTOMER"; payload: any }
  | { type: "SET_ORDER_DETAILS"; payload: any }
  | { type: "RESET" }

// Define the context type
interface BookingContextType {
  state: BookingState
  dispatch: React.Dispatch<BookingAction>
  steps: { step: number; title: string }[]
}

// Create the context
const BookingContext = createContext<BookingContextType | undefined>(undefined)

// Define the booking steps
const bookingSteps = [
  { step: 1, title: "Search" },
  { step: 2, title: "Select Venue" },
  { step: 3, title: "Select Room" },
  { step: 4, title: "Add Services" },
  { step: 5, title: "Your Details" },
  { step: 6, title: "Confirmation" },
]

// Initial state
const initialState: BookingState = {
  currentStep: 1,
  searchParams: null,
  selectedVenue: null,
  selectedRoom: null,
  selectedPackage: null,
  selectedAddons: [],
  customer: null,
  orderDetails: null,
}

// Reducer function
function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "SET_CURRENT_STEP":
      return { ...state, currentStep: action.payload }
    case "SET_SEARCH_PARAMS":
      return { ...state, searchParams: action.payload }
    case "SET_SELECTED_VENUE":
      return { ...state, selectedVenue: action.payload }
    case "SET_SELECTED_ROOM":
      return { ...state, selectedRoom: action.payload, selectedPackage: null }
    case "SET_SELECTED_PACKAGE":
      return { ...state, selectedPackage: action.payload, selectedRoom: null }
    case "SET_SELECTED_ADDONS":
      return { ...state, selectedAddons: action.payload }
    case "SET_CUSTOMER":
      return { ...state, customer: action.payload }
    case "SET_ORDER_DETAILS":
      return { ...state, orderDetails: action.payload }
    case "RESET":
      return initialState
    default:
      return state
  }
}

// Provider component
export function BookingProvider({ children }: { children: ReactNode }) {
  // Try to load state from localStorage
  const savedState = typeof window !== "undefined" ? localStorage.getItem("bookingState") : null
  const parsedState = savedState ? JSON.parse(savedState) : initialState

  const [state, dispatch] = useReducer(bookingReducer, parsedState)

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bookingState", JSON.stringify(state))
    }
  }, [state])

  return <BookingContext.Provider value={{ state, dispatch, steps: bookingSteps }}>{children}</BookingContext.Provider>
}

// Custom hook to use the booking context
export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}
