type Currency = 'USD' | 'EUR' | 'GBP' | string;
type AccommodationType = 'hotel' | 'apartment' | 'hostel';
type FlightStatus = 'available' | 'booked' | 'cancelled';
type AccommodationStatus = 'available' | 'booked' | 'cancelled';

interface FlightBookingLinks {
  googleFlights: string;
  skyscanner: string;
  kayak: string;
}

interface Flight {
  airline: string;
  arrival_date: string;
  arrival_time: string;
  booking_reference: string;
  booking_link?: string;
  booking_links?: FlightBookingLinks;
  created_at: string;
  currency: Currency;
  departure_date: string;
  departure_time: string;
  destination_airport: string;
  destination_city: string;
  flight_number: string;
  id: number | null;
  is_direct: boolean;
  is_return_flight: boolean;
  is_estimated_price?: boolean;
  notes: string;
  origin_airport: string;
  origin_city: string;
  price: number;
  price_range?: { min: number; max: number };
  seat_number: string | null;
  segments_count: number;
  status: FlightStatus;
  total_duration: number;
  total_duration_formatted: string;
  transit_airports: string[];
  transit_cities: string[];
  transit_summary: string;
  trip_id: string;
}

interface HotelBookingLinks {
  bookingCom: string;
  hotelsCom: string;
  expedia: string;
  airbnb: string;
}

interface Stay {
  address: string;
  amenities: string[] | null;
  booking_link: string;
  booking_links?: HotelBookingLinks;
  booking_reference: string | null;
  check_in_date: string;
  check_in_time: string;
  check_out_date: string;
  check_out_time: string;
  city: string;
  country: string;
  created_at: string;
  currency: Currency;
  email: string | null;
  guests_count: number;
  id: number;
  is_verified?: boolean;
  name: string;
  nights_count: number;
  notes: string;
  phone: string | null;
  photo: string;
  price_per_night: number;
  price_range?: { min: number; max: number };
  rating: number;
  room_type: string | null;
  stars?: number;
  status: AccommodationStatus;
  total_price: number;
  trip_id: string;
  type: AccommodationType;
  website: string;
}

interface BudgetAnalysis {
  accommodation_cost: number;
  budget_feedback: string;
  budget_percentage_used: number;
  currency: Currency;
  flight_cost: number;
  on_budget: boolean;
  remaining_budget: number;
  total_cost: number;
  user_budget: number;
}

interface UserDetails {
  budget: number;
  current_city: string;
  current_country: string;
  dates_end: string;
  dates_start: string;
  destination_city: string;
  destination_country: string;
  travel_interests: string;
  travel_style: string;
}

interface Metadata {
  aiEnabled: boolean;
  flightCount: number;
  stayCount: number;
  timestamp: string;
}

interface TravelBookingResponse {
  budget_analysis: BudgetAnalysis;
  flight_reason: string;
  flights: Flight[];
  hotel_reason: string;
  metadata: Metadata;
  quick_tips: string[];
  recommended_outbound_flight: Flight,
  recommended_return_flight: Flight,
  recommended_hotel: Stay;
  stays: Stay[];
  userDetails: UserDetails;
}

export type {
  AccommodationStatus, AccommodationType, BudgetAnalysis, Currency, Flight, FlightBookingLinks, FlightStatus, HotelBookingLinks, Metadata, Stay, TravelBookingResponse, UserDetails
};

