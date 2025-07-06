// Enums
type FlightStatus = 'booked' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
type StayType = 'hotel' | 'airbnb' | 'hostel' | 'resort' | 'apartment' | 'other';
type PlaceType = 'attraction' | 'restaurant' | 'museum' | 'park' | 'beach' | 'shopping' | 'nightlife' | 'activity' | 'other';
type OptionType = 'must_see' | 'would_like' | 'if_time' | 'backup';
type StatusType = 'planned' | 'visited' | 'skipped';
type TransportType = 'train' | 'bus' | 'car_rental' | 'taxi' | 'uber' | 'metro' | 'ferry' | 'other';

// Flights
export interface Flight {
  id: number;
  trip_id: string;
  flight_number: string;
  airline?: string;
  departure_date: string; // ISO date
  departure_time?: string; // HH:MM:SS
  arrival_date?: string;
  arrival_time?: string;
  origin_airport: string;
  origin_city?: string;
  destination_airport: string;
  destination_city?: string;
  price?: number;
  currency?: string;
  booking_reference?: string;
  seat_number?: string;
  notes?: string;
  status?: FlightStatus;
  is_return_flight?: boolean;
  created_at?: string;
}

// Stays
export interface Stay {
  id: number;
  trip_id: string;
  name: string;
  type?: StayType;
  address?: string;
  city?: string;
  country?: string;
  check_in_date: string;
  check_in_time?: string;
  check_out_date: string;
  check_out_time?: string;
  nights_count?: number;
  price_per_night?: number;
  total_price?: number;
  currency?: string;
  booking_reference?: string;
  room_type?: string;
  guests_count?: number;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  notes?: string;
  amenities?: any; // adjust if you know the shape
  status?: FlightStatus;
  created_at?: string;
}

// Places to Visit
export interface PlaceToVisit {
  id: number;
  trip_id: string;
  name: string;
  type?: PlaceType;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  visit_date?: string;
  visit_time?: string;
  duration_hours?: number;
  estimated_cost?: number;
  currency?: string;
  priority?: OptionType;
  phone?: string;
  website?: string;
  rating?: number;
  opening_hours?: any;
  notes?: string;
  tags?: any;
  status?: StatusType;
  created_at?: string;
}

// Transportation
export interface Transportation {
  id: number;
  trip_id: string;
  type: TransportType;
  name?: string;
  departure_date: string;
  departure_time?: string;
  arrival_date?: string;
  arrival_time?: string;
  origin: string;
  destination: string;
  price?: number;
  currency?: string;
  booking_reference?: string;
  provider?: string;
  notes?: string;
  status?: FlightStatus;
  created_at?: string;
}
