import axios from "axios"
import type {
  VenueSearchParams,
  AvailabilitySearchParams,
  RoomAvailabilityParams,
  Venue,
  AvailableRoom,
  AvailablePackage,
  Addon,
  Customer,
  NewCustomer,
  OrderRequest,
  OrderInfo,
  OrderDetails,
  PaginatedResponse,
} from "@booking-journey/shared/types"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": process.env.REACT_APP_API_KEY || "demo-api-key",
  },
})

// Search API
export const searchVenues = async (params: VenueSearchParams): Promise<PaginatedResponse<Venue>> => {
  const response = await api.get("/venues", { params })
  return response.data
}

// Availability API
export const getVenuesAvailability = async (params: AvailabilitySearchParams): Promise<PaginatedResponse<Venue>> => {
  const response = await api.get("/availability/venues", { params })
  return response.data
}

export const getVenueAvailability = async (id: number, params: RoomAvailabilityParams): Promise<AvailableRoom[]> => {
  const response = await api.get(`/availability/venues/${id}`, { params })
  return response.data
}

export const getVenuePackageAvailability = async (
  id: number,
  params: RoomAvailabilityParams,
): Promise<AvailablePackage[]> => {
  const response = await api.get(`/availability/venues/${id}/packages`, { params })
  return response.data
}

// Content API
export const getVenueDetails = async (id: number, lang?: string): Promise<Venue> => {
  const response = await api.get(`/venues/${id}`, { params: { lang } })
  return response.data
}

export const getVenueAddons = async (id: number, params?: any): Promise<Addon[]> => {
  const response = await api.get(`/venues/${id}/addons`, { params })
  return response.data
}

// Customer API
export const createCustomer = async (customer: NewCustomer): Promise<Customer> => {
  const response = await api.post("/customers", customer)
  return response.data
}

// Order API
export const createOrder = async (order: OrderRequest): Promise<OrderInfo> => {
  const response = await api.post("/orders", order)
  return response.data
}

export const getOrderDetails = async (id: string): Promise<OrderDetails> => {
  const response = await api.get(`/orders/${id}`)
  return response.data
}
