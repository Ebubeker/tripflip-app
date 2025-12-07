// Trip search request types
export interface TripSearchRequest {
  origin: string;
  destination: string;
  startDate: string;
  endDate?: string;
  nights?: number;
  oneWay: boolean;
  adults: number;
  children?: number;
  budget?: number;
}

// Flight types
export interface FlightSegment {
  departure: {
    airport: string;
    time: string;
  };
  arrival: {
    airport: string;
    time: string;
  };
  duration: string;
  carrier: string;
  flightNumber: string;
}

export interface FlightOption {
  id: string;
  totalPrice: number;
  currency: string;
  outboundSegments: FlightSegment[];
  returnSegments?: FlightSegment[];
  airline: string;
}

// Hotel types
export interface HotelOption {
  id: string;
  name: string;
  pricePerNight: number;
  totalPrice: number;
  currency: string;
  rating: number;
  location: string;
  imageUrl?: string;
  description?: string;
}

// Trip package types
export interface TripPackage {
  id: string;
  flight: FlightOption;
  hotel: HotelOption;
  totalPrice: number;
  pricePerPerson: number;
  currency: string;
  recommendationType?: "Cheapest" | "Best Value" | "Most Comfortable";
}

// AI summary types
export interface AISummary {
  overview: string;
  recommendations: {
    packageId: string;
    type: "Cheapest" | "Best Value" | "Most Comfortable";
    explanation: string;
  }[];
}

// Trip search response
export interface TripSearchResponse {
  packages: TripPackage[];
  aiSummary?: AISummary;
  error?: string;
}
