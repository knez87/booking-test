import axios from "axios"
import type { AvailabilitySearchParams, NewCustomer, OrderRequest } from "@booking-journey/shared/types"

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": process.env.REACT_APP_API_KEY || "",
  },
})

// Add request interceptor for loading states
api.interceptors.request.use(
  (config) => {
    // You could dispatch a loading action here
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with non-2xx status
      console.error("API Error:", error.response.data)
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error:", error.request)
    } else {
      // Something else happened
      console.error("Error:", error.message)
    }
    return Promise.reject(error)
  },
)

// Search API
export const getVenuesAvailability = async (params: AvailabilitySearchParams) => {
  try {
    const response = await api.get("/availability/venues", { params })
    return response.data
  } catch (error) {
    console.error("Failed to fetch venues availability:", error)
    throw error
  }
}

// Venue Details API
export const getVenueDetails = async (venueId: number) => {
  try {
    const response = await api.get(`/venues/${venueId}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch venue details for ID ${venueId}:`, error)
    throw error
  }
}

// Venue Availability API
export const getVenueAvailability = async (venueId: number, params: any) => {
  try {
    const response = await api.get(`/availability/venues/${venueId}`, { params })
    return response.data
  } catch (error) {
    console.error(`Failed to fetch venue availability for ID ${venueId}:`, error)
    throw error
  }
}

// Venue Package Availability API
export const getVenuePackageAvailability = async (venueId: number, params: any) => {
  try {
    const response = await api.get(`/availability/venues/${venueId}/packages`, { params })
    return response.data
  } catch (error) {
    console.error(`Failed to fetch venue package availability for ID ${venueId}:`, error)
    throw error
  }
}

// Venue Addons API
export const getVenueAddons = async (venueId: number, params: any) => {
  try {
    const response = await api.get(`/venues/${venueId}/addons`, { params })
    return response.data
  } catch (error) {
    console.error(`Failed to fetch venue addons for ID ${venueId}:`, error)
    throw error
  }
}

// Create Customer API
export const createCustomer = async (customerData: NewCustomer) => {
  try {
    const response = await api.post("/customers", customerData)
    return response.data
  } catch (error) {
    console.error("Failed to create customer:", error)
    throw error
  }
}

// Customer APIs
export const getCustomer = async (customerId: number) => {
  try {
    const response = await api.get(`/customers/${customerId}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch customer details for ID ${customerId}:`, error)
    throw error
  }
}

// Order APIs
export const createOrder = async (orderData: OrderRequest) => {
  try {
    const response = await api.post("/orders", orderData)
    return response.data
  } catch (error) {
    console.error("Failed to create order:", error)
    throw error
  }
}

export const getOrderDetails = async (orderId: string) => {
  try {
    const response = await api.get(`/orders/${orderId}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch order details for ID ${orderId}:`, error)
    throw error
  }
}

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await api.put(`/orders/${orderId}`, { status })
    return response.data
  } catch (error) {
    console.error(`Failed to update order ID ${orderId}:`, error)
    throw error
  }
}

export const getOrderMessages = async (orderId: string) => {
  try {
    const response = await api.get(`/orders/${orderId}/messages`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch order messages for ID ${orderId}:`, error)
    throw error
  }
}

export const sendOrderMessage = async (orderId: string, message: string) => {
  try {
    const response = await api.post(`/orders/${orderId}/messages`, { message })
    return response.data
  } catch (error) {
    console.error(`Failed to send order message for ID ${orderId}:`, error)
    throw error
  }
}

// Room & Package specific APIs
export const getRoomDetails = async (roomId: number) => {
  try {
    const response = await api.get(`/rooms/${roomId}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch room details for ID ${roomId}:`, error)
    throw error
  }
}

export const getRoomAvailability = async (roomId: number, params: any) => {
  try {
    const response = await api.get(`/availability/meetingrooms/${roomId}`, { params })
    return response.data
  } catch (error) {
    console.error(`Failed to fetch room availability for ID ${roomId}:`, error)
    throw error
  }
}

export const getPackageAvailability = async (packageId: number, params: any) => {
  try {
    const response = await api.get(`/availability/packages/${packageId}`, { params })
    return response.data
  } catch (error) {
    console.error(`Failed to fetch package availability for ID ${packageId}:`, error)
    throw error
  }
}

export const getDayAvailability = async (venueId: number, date: string) => {
  try {
    const response = await api.get(`/availability/venues/${venueId}/day`, { params: { date } })
    return response.data
  } catch (error) {
    console.error(`Failed to fetch day availability for venue ID ${venueId}:`, error)
    throw error
  }
}

// Utility functions
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return "Invalid request. Please check your input and try again."
        case 401:
          return "Authentication required. Please log in."
        case 403:
          return "Access denied. You don't have permission for this action."
        case 404:
          return "The requested resource was not found."
        case 409:
          return "Conflict. The resource already exists or is in use."
        case 422:
          return "Validation error. Please check your input."
        case 429:
          return "Too many requests. Please wait and try again."
        case 500:
          return "Server error. Please try again later."
        case 503:
          return "Service temporarily unavailable. Please try again later."
        default:
          return error.response.data.message || "An unexpected error occurred."
      }
    } else if (error.request) {
      return "Network error occurred."
    } else {
      return error.message || "An unexpected error occurred."
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "An unexpected error occurred."
}

export default api
