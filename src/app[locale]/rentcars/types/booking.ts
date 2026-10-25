export interface PropertyType {
  id: string;
  name: string;
  location: string;
  country: string;
  price: number;
  rating?: number;
  image?: string;
}

export interface HotelSearchItem {
  id: string;
  name: string;
  location: string;
  country: string;
  price: number;
  rating?: number;
  image?: string;
}

export interface HotelSearchItem {
  id: string;
  name: string;
  location: string;
  country: string;
  price: number;
  rating?: number;
  image?: string;
}

export interface SearchResult {
  stays: HotelSearchItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Booking {
  id: string;
  userId: string;
  stayId?: string;
  propertyType?: string;
  status: PropertyStatus;
  totalPrice: number;
  voucherId?: string;
  discountAmount?: number;
  travelDate?: DateTime;
  checkIn?: DateTime;
  checkOut?: DateTime;
  rooms?: number;
  guests?: number;
  roomTypeId?: string;
  rooms?: number;
  guests?: number;
  rooms?: number;
  guests?: number;
  roomTypeId?: string;
  rooms?: number;
  guests?: number;
  roomTypeId?: string;
  rooms?: number;
  guests?: number;
  checkIn?: DateTime;
  checkOut?: DateTime;
  rooms?: number;
  guests?: number;
  roomTypeId?: string;
  rooms?: number;
  guests?: number;
  checkIn?: DateTime;
  checkOut?: DateTime;
  rooms?: number;
  guests?: number;
  roomTypeId?: string;
  rooms?: number;
  guests?: number;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface BookingCreateRequest {
  propertyType: PropertyType;
  currentStep: number;
  name: string;
  location: string;
  pricePerNight: number;
  images: string[];
  checkIn: DateTime;
  checkOut: DateTime;
  rooms: number;
  guests: number;
}

export interface BookingResponse {
  success: boolean;
  booking?: Booking;
  error?: string;
}

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalUsers: number;
  totalHosts: number;
  totalStays: number;
  totalFlights: number;
  totalActivities: number;
  totalTransports: number;
}

export interface PropertySearchParams {
  destination?: string;
  country?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
  tab?: string;
  minPrice?: number;
  maxPrice?: number;
  stars?: number;
  propertyType?: string;
  amenity?: string;
  sort?: string;
  page?: number;
  size?: number;
}

export interface HotelSearchItem {
  id: string;
  name: string;
  location: string;
  country: string;
  price: number;
  rating?: number;
  image?: string;
}

export interface HotelSearchItem {
  id: string;
  name: string;
  location: string;
  country: string;
  price: number;
  rating?: number;
  image?: string;
}

export interface HotelSearchItem {
  id: string;
  name: string;
  location: string;
  country: string;
  price: number;
  rating?: number;
  image?: string;
}

export interface SearchResult {
  stays: HotelSearchItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  propertyType?: PropertyType;
  status: PropertyStatus;
  totalPrice: number;
  voucherId?: string;
  discountAmount: number;
  travelDate?: DateTime;
  checkIn?: DateTime;
  checkOut?: DateTime;
  stayId?: string;
  stay?: Stay;
  flightId?: string;
  flight?: Flight;
  roomTypeId?: string;
  rooms?: number;
  guests?: number;
  roomTypeId?: string;
  rooms?: number;
  guests?: number;
  checkIn?: DateTime;
  checkOut?: DateTime;
  rooms?: number;
  guests?: number;
  roomTypeId?: string;
  rooms?: number;
  guests?: number;
  checkIn?: DateTime;
  checkOut?: DateTime;
  rooms?: number;
  guests?: number;
  roomTypeId?: string;
  rooms?: number;
  guests?: number;
  checkIn?: DateTime;
  checkOut?: DateTime;
  rooms?: number;
  guests?: number;
  roomTypeId?: string;
  rooms?: number;
  guests?: number;
  checkIn?: DateTime;
  checkOut?: DateTime;
  rooms?: number;
  guests?: number;
  roomTypeId?: string;
  rooms?: number;
  guests?: number;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface BookingCreateRequest {
  propertyType: PropertyType;
  currentStep: number;
  name: string;
  location: string;
  pricePerNight: number;
  imageUrl?: string;
  description?: string;
  phone?: string;
  email?: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
}

export interface BookingResponse {
  success: boolean;
  booking?: Booking;
  error?: string;
}

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalUsers: number;
  totalHosts: number;
  totalStays: number;
  totalFlights: number;
  totalActivities: number;
  totalTransports: number;
}

export interface StaySearchParams {
  destination?: string;
  country?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
  tab?: string;
  minPrice?: number;
  maxPrice?: number;
  stars?: number;
  propertyType?: string;
  amenity?: string;
  sort?: string;
  page?: number;
  size?: number;
}
