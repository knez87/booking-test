"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { BookingState, BookingStep } from "@booking-journey/shared/types"

interface BookingContextType {
  state: BookingState
  dispatch: React.Dispatch<BookingAction>
  steps: BookingStep[]
}

type BookingAction =
  | { type: "SET_SEARCH_PARAMS"; payload: any }
  | { type: "SET_SELECTED_VENUE"; payload: any }
  | { type: "SET_SELECTED_ROOM"; payload: any }
  | { type: "SET_SELECTED_PACKAGE"; payload: any }
  | { type: "SET_SELECTED_ADDONS"; payload: any }
  | { type: "SET_CUSTOMER"; payload: any }
  | { type: "SET_ORDER_DETAILS"; payload: any }
  | { type: "SET_CURRENT_STEP"; payload: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET" }

const initialState: BookingState = {
  currentStep: 1,
}

const steps: BookingStep[] = [
  { step: 1, title: "Search", completed: false, active: true },
  { step: 2, title: "Select Venue", completed: false, active: false },
  { step: 3, title: "Choose Room/Package", completed: false, active: false },
  { step: 4, title: "Add Services", completed: false, active: false },
  { step: 5, title: "Customer Details", completed: false, active: false },
  { step: 6, title: "Confirmation", completed: false, active: false },
]

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "SET_SEARCH_PARAMS":
      return { ...state, searchParams: action.payload }
    case "SET_SELECTED_VENUE":
      return { ...state, selectedVenue: action.payload }
    case "SET_SELECTED_ROOM":
      return { ...state, selectedRoom: action.payload }
    case "SET_SELECTED_PACKAGE":
      return { ...state, selectedPackage: action.payload }
    case "SET_SELECTED_ADDONS":
      return { ...state, selectedAddons: action.payload }
    case "SET_CUSTOMER":
      return { ...state, customer: action.payload }
    case "SET_ORDER_DETAILS":
      return { ...state, orderDetails: action.payload }
    case "SET_CURRENT_STEP":
      return { ...state, currentStep: action.payload }
    case "NEXT_STEP":
      return { ...state, currentStep: Math.min(state.currentStep + 1, steps.length) }
    case "PREV_STEP":
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) }
    case "RESET":
      return initialState
    default:
      return state
  }
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState)

  const contextValue: BookingContextType = {
    state,
    dispatch,
    steps,
  }

  return <BookingContext.Provider value={contextValue}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}
