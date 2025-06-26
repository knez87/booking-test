// Shared types based on MeetingPackage API specification

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  results: number
  total_results: number
  offset?: number
  limit?: number
}

export interface Address {
  street: string
  postal_code: string
  city: string
  country: string
}

export interface Image {
  url: string
}

export interface Price {
  hourly?: number
  half_day?: number
  full_day?: number
  per_person?: number
  currency: string
}

export interface Venue {
  id: number
  name: string
  address: Address
  latitude: string
  longitude: string
  summary?: string
  language_summary?: string
  images: Image[]
  currency: string
  max_delegates?: number
  starting_price_cents?: number
  facilities?: Facility[]
  nearby?: NearbyItem[]
  additionals?: AdditionalService[]
  sports?: SportService[]
  rooms?: Room[]
  packages?: Package[]
  package_addon?: boolean
}

export interface Facility {
  id: number
  facility_description: string
  localized_description?: string
}

export interface NearbyItem {
  id: number
  description: string
  description_localized?: string
}

export interface AdditionalService {
  id: number
  description: string
  description_localized?: string
}

export interface SportService {
  id: number
  description: string
  description_localized?: string
}

export interface Room {
  id: number
  name: string
  min_delegates: number
  max_delegates: number
  instant_bookable: boolean
  credit_card_required: boolean
  description?: string
  images: Image[]
  equipments: Equipment[]
  layouts: Layout[]
  dimensions?: RoomDimensions
}

export interface Equipment {
  id: number
  description: string
  description_localized?: string
  free: boolean
}

export interface Layout {
  name: string
  max_delegates: number
}

export interface RoomDimensions {
  area?: string
  width?: string
  height?: string
  length?: string
  unit?: string
}

export interface Package {
  id: number
  name: string
  min_delegates: number
  max_delegates: number
  rooms: number[]
  info?: string
  includes: PackageInclude[]
}

export interface PackageInclude {
  id: number
  description: string
}

export interface AvailableRoom {
  availability_id: string
  name: string
  id: number
  venue_id: number
  min_delegates: number
  max_delegates: number
  amount_inc_tax: number
  amount: number
  currency: string
  minimum_spend?: number
  instant_bookable: boolean
  credit_card_required: boolean
  description?: string
  images: Image[]
  equipments: Equipment[]
  layouts: Layout[]
  dimensions?: RoomDimensions
}

export interface AvailablePackage {
  availability_id: string
  name: string
  min_delegates: number
  max_delegates: number
  amount_inc_tax: number
  amount: number
  price_adjusted_for_min_delegates: boolean
  rooms: number[]
  info?: string
  includes: PackageInclude[]
  negotiated_rate?: {
    code: string
    original_amount: number
    original_amount_inc_tax: number
  }
}

export interface Customer {
  id: string
  email: string
  company?: string
  phone?: string
  first_name?: string
  last_name?: string
  billing_address?: Address
}

export interface NewCustomer {
  first_name: string
  last_name: string
  email: string
  company?: string
  phone?: string
  billing_address?: Address & {
    country_code: string
    state?: string
    cost_center?: string
  }
}

export interface OrderRequest {
  availability_id: string
  customer_id: string
  layout?: string
  room_id?: number
  additional_notes?: string
  host_name?: string
  event_name?: string
  discount_code?: string
  addons?: OrderAddon[]
}

export interface OrderAddon {
  id: number
  quantity: number
}

export interface OrderInfo {
  id: string
  booking_reference: string
}

export interface OrderDetails {
  id: number
  status: string
  created_date: string
  currency: string
  amount_inc_tax: number
  provisional_hold_date?: string
  host_name?: string
  event_name?: string
  start: string
  end: string
  delegates: number
  rooms: RoomDetails[]
  items: OrderItem[]
}

export interface RoomDetails {
  name: string
  layout?: string
}

export interface OrderItem {
  name: string
  product: string
  quantity: number
  start_time?: string
  end_time?: string
  account_category?: string
  unit: string
  unit_price: number
  unit_price_inc_tax: number
  amount: number
  amount_inc_tax: number
  is_package_content: boolean
}

export interface Addon {
  id: number
  description: string
  category: string
  currency: string
  amount: number
  amount_inc_tax: number
  unit: string
  available_rooms?: number[]
  package_addon?: boolean
  available_packages?: string[]
}

// Search and filter interfaces
export interface VenueSearchParams {
  lat: string
  lng: string
  radius?: number
  limit?: number
  offset?: number
}

export interface AvailabilitySearchParams extends VenueSearchParams {
  delegates: number
  start_date: string
  start_time: string
  duration: number
  type?: "meetingrooms" | "packages"
  layout?: string
  discount_code?: string
}

export interface RoomAvailabilityParams {
  delegates: number
  start_date: string
  start_time: string
  duration: number
  layout?: string
  discount_code?: string
}

// Error handling
export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

// Booking journey specific types
export interface BookingStep {
  step: number
  title: string
  completed: boolean
  active: boolean
}

export interface BookingState {
  searchParams?: AvailabilitySearchParams
  selectedVenue?: Venue
  selectedRoom?: AvailableRoom
  selectedPackage?: AvailablePackage
  selectedAddons?: (Addon & { quantity: number })[]
  customer?: Customer
  orderDetails?: OrderDetails
  currentStep: number
}
