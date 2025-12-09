import axios from 'axios';
import {
  generateAllFlightLinks,
  generateAllHotelLinks,
  estimatePriceRange,
  getAirportCode,
  realHotelsData,
  realAirlinesData,
} from '../services/bookingLinks';
import type { Flight, Stay } from '@/type/recommendation';

interface RecommendationParams {
  destination_city: string,
  destination_country: string,
  budget: number,
  dates_start: Date,
  dates_end: Date,
  current_city: string,
  current_country: string,
  travel_style: string,
  travel_interests: string,
  passengers?: {
    adults: number,
    children: number,
    infants: number,
  },
  class?: string,
}

// Add booking links to a flight
const enhanceFlightWithBookingLinks = (
  flight: any,
  params: RecommendationParams
): Flight => {
  const originCity = flight.origin_city || params.current_city || 'Unknown';
  const destCity = flight.destination_city || params.destination_city;
  const departureDate = flight.departure_date || params.dates_start;
  const returnDate = flight.is_return_flight ? undefined : params.dates_end;
  const cabinClass = params.class || 'economy';
  const passengers = params.passengers?.adults || 1;

  // Generate booking links
  const bookingLinks = generateAllFlightLinks(
    originCity,
    destCity,
    departureDate,
    returnDate,
    passengers,
    cabinClass
  );

  // Get price range estimate
  const priceRange = estimatePriceRange(originCity, destCity, cabinClass);

  // Update flight with booking links
  return {
    ...flight,
    booking_link: bookingLinks.googleFlights,
    booking_links: bookingLinks,
    price_range: priceRange,
    is_estimated_price: true,
    notes: `Search for exact prices on Google Flights, Skyscanner, or Kayak. Price shown is an estimate based on typical routes. Booking URL: ${bookingLinks.googleFlights}`,
  };
};

// Add booking links to a stay
const enhanceStayWithBookingLinks = (
  stay: any,
  params: RecommendationParams
): Stay => {
  const city = stay.city || params.destination_city;
  const country = stay.country || params.destination_country;
  const checkIn = stay.check_in_date || params.dates_start;
  const checkOut = stay.check_out_date || params.dates_end;
  const guests = params.passengers?.adults || 2;

  // Generate booking links
  const bookingLinks = generateAllHotelLinks(
    city,
    country,
    checkIn,
    checkOut,
    guests,
    1
  );

  // Check if we have real hotel data for this city
  const cityKey = city.toLowerCase();
  const realHotels = realHotelsData[cityKey];
  let isVerified = false;
  let realHotelMatch = null;

  if (realHotels) {
    // Try to find a matching real hotel or use one from our database
    realHotelMatch = realHotels.find(h =>
      h.name.toLowerCase().includes(stay.name?.toLowerCase()?.split(' ')[0] || '')
    );
  }

  return {
    ...stay,
    booking_link: bookingLinks.bookingCom,
    booking_links: bookingLinks,
    is_verified: isVerified,
    notes: `Search for this hotel or similar options on Booking.com, Hotels.com, or Expedia. Verify availability and exact prices on the booking platform.`,
    // Ensure photo is present
    photo: stay.photo || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
  };
};

// Process API response to add booking links
const processApiResponse = (response: any, params: RecommendationParams) => {
  if (!response?.data) return response;

  const data = { ...response.data };

  // Enhance flights with booking links
  if (data.flights && Array.isArray(data.flights)) {
    data.flights = data.flights.map((flight: any) =>
      enhanceFlightWithBookingLinks(flight, params)
    );
  }

  // Enhance recommended flights
  if (data.recommended_outbound_flight) {
    data.recommended_outbound_flight = enhanceFlightWithBookingLinks(
      data.recommended_outbound_flight,
      params
    );
  }
  if (data.recommended_return_flight) {
    data.recommended_return_flight = enhanceFlightWithBookingLinks(
      data.recommended_return_flight,
      params
    );
  }

  // Enhance stays with booking links
  if (data.stays && Array.isArray(data.stays)) {
    data.stays = data.stays.map((stay: any) =>
      enhanceStayWithBookingLinks(stay, params)
    );
  }

  // Enhance recommended hotel
  if (data.recommended_hotel) {
    data.recommended_hotel = enhanceStayWithBookingLinks(
      data.recommended_hotel,
      params
    );
  }

  return { ...response, data };
};

export const fetchRecommendations = async (params: RecommendationParams): Promise<any> => {
  console.log("params", params)
  const options = {
    method: 'POST',
    url: 'https://travelio-nju8.onrender.com/user-details',
    data: params,
  };

  try {
    const response = await axios.request(options);
    // Add booking links to all flights and stays
    return processApiResponse(response, params);
  } catch (error) {
    console.log("Error fetching recommendations:", error);
    throw error;
  }
}

export const fetchFlights = async (params: RecommendationParams): Promise<any> => {
  const options = {
    method: 'POST',
    url: 'https://travelio-nju8.onrender.com/flights',
    data: params,
  };

  try {
    const response = await axios.request(options);
    // Add booking links to all flights
    return processApiResponse(response, params);
  } catch (error) {
    console.log("Error fetching flights:", error);
    throw error;
  }
}

export const fetchStays = async (params: RecommendationParams): Promise<any> => {
  const options = {
    method: 'POST',
    url: 'https://travelio-nju8.onrender.com/stays',
    data: params,
  };

  try {
    const response = await axios.request(options);
    // Add booking links to all stays
    return processApiResponse(response, params);
  } catch (error) {
    console.log("Error fetching stays:", error);
    throw error;
  }
}

// Export utility functions for use in components
export { generateAllFlightLinks, generateAllHotelLinks, estimatePriceRange };