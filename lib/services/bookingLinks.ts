/**
 * Booking Links Service
 *
 * Generates deep links to real flight and hotel booking aggregators
 * so users can verify prices and book directly on trusted platforms.
 */

// Airport code mapping for common cities
const cityToAirportCode: Record<string, string> = {
  'tirana': 'TIA',
  'vienna': 'VIE',
  'london': 'LHR',
  'paris': 'CDG',
  'new york': 'JFK',
  'los angeles': 'LAX',
  'rome': 'FCO',
  'berlin': 'BER',
  'amsterdam': 'AMS',
  'madrid': 'MAD',
  'barcelona': 'BCN',
  'munich': 'MUC',
  'frankfurt': 'FRA',
  'zurich': 'ZRH',
  'brussels': 'BRU',
  'milan': 'MXP',
  'lisbon': 'LIS',
  'athens': 'ATH',
  'dublin': 'DUB',
  'prague': 'PRG',
  'budapest': 'BUD',
  'warsaw': 'WAW',
  'copenhagen': 'CPH',
  'stockholm': 'ARN',
  'oslo': 'OSL',
  'helsinki': 'HEL',
  'istanbul': 'IST',
  'dubai': 'DXB',
  'tokyo': 'NRT',
  'singapore': 'SIN',
  'bangkok': 'BKK',
  'hong kong': 'HKG',
  'sydney': 'SYD',
  'melbourne': 'MEL',
};

// Get airport code from city name
export const getAirportCode = (city: string): string => {
  const normalizedCity = city.toLowerCase().trim();
  return cityToAirportCode[normalizedCity] || city.toUpperCase().slice(0, 3);
};

// Format date for URL parameters (YYYY-MM-DD)
const formatDateForUrl = (date: string | Date): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Generate Google Flights search URL
 */
export const generateGoogleFlightsLink = (
  originCity: string,
  destinationCity: string,
  departureDate: string | Date,
  returnDate?: string | Date,
  passengers: number = 1,
  cabinClass: string = 'economy'
): string => {
  const origin = getAirportCode(originCity);
  const destination = getAirportCode(destinationCity);
  const depDate = formatDateForUrl(departureDate);

  // Google Flights URL format
  let url = `https://www.google.com/travel/flights?q=flights%20from%20${origin}%20to%20${destination}%20on%20${depDate}`;

  if (returnDate) {
    const retDate = formatDateForUrl(returnDate);
    url += `%20returning%20${retDate}`;
  }

  return url;
};

/**
 * Generate Skyscanner search URL
 */
export const generateSkyscannerLink = (
  originCity: string,
  destinationCity: string,
  departureDate: string | Date,
  returnDate?: string | Date,
  passengers: number = 1,
  cabinClass: string = 'economy'
): string => {
  const origin = getAirportCode(originCity);
  const destination = getAirportCode(destinationCity);
  const depDate = formatDateForUrl(departureDate).replace(/-/g, '');

  // Skyscanner URL format
  let url = `https://www.skyscanner.com/transport/flights/${origin.toLowerCase()}/${destination.toLowerCase()}/${depDate.slice(2)}`;

  if (returnDate) {
    const retDate = formatDateForUrl(returnDate).replace(/-/g, '');
    url += `/${retDate.slice(2)}`;
  }

  url += `/?adults=${passengers}&cabinclass=${cabinClass}`;

  return url;
};

/**
 * Generate Kayak search URL
 */
export const generateKayakLink = (
  originCity: string,
  destinationCity: string,
  departureDate: string | Date,
  returnDate?: string | Date,
  passengers: number = 1,
  cabinClass: string = 'economy'
): string => {
  const origin = getAirportCode(originCity);
  const destination = getAirportCode(destinationCity);
  const depDate = formatDateForUrl(departureDate);

  let url = `https://www.kayak.com/flights/${origin}-${destination}/${depDate}`;

  if (returnDate) {
    const retDate = formatDateForUrl(returnDate);
    url += `/${retDate}`;
  }

  url += `?sort=bestflight_a&fs=cabin=${cabinClass === 'economy' ? 'e' : cabinClass === 'business' ? 'b' : 'f'}`;

  return url;
};

/**
 * Generate Booking.com hotel search URL
 */
export const generateBookingComLink = (
  city: string,
  country: string,
  checkInDate: string | Date,
  checkOutDate: string | Date,
  guests: number = 2,
  rooms: number = 1
): string => {
  const checkIn = formatDateForUrl(checkInDate);
  const checkOut = formatDateForUrl(checkOutDate);
  const destination = encodeURIComponent(`${city}, ${country}`);

  return `https://www.booking.com/searchresults.html?ss=${destination}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}&no_rooms=${rooms}&selected_currency=USD`;
};

/**
 * Generate Hotels.com search URL
 */
export const generateHotelsComLink = (
  city: string,
  country: string,
  checkInDate: string | Date,
  checkOutDate: string | Date,
  guests: number = 2,
  rooms: number = 1
): string => {
  const checkIn = formatDateForUrl(checkInDate);
  const checkOut = formatDateForUrl(checkOutDate);
  const destination = encodeURIComponent(`${city}, ${country}`);

  return `https://www.hotels.com/search.do?destination=${destination}&startDate=${checkIn}&endDate=${checkOut}&rooms=${rooms}&adults=${guests}`;
};

/**
 * Generate Expedia hotel search URL
 */
export const generateExpediaLink = (
  city: string,
  country: string,
  checkInDate: string | Date,
  checkOutDate: string | Date,
  guests: number = 2,
  rooms: number = 1
): string => {
  const checkIn = formatDateForUrl(checkInDate);
  const checkOut = formatDateForUrl(checkOutDate);
  const destination = encodeURIComponent(`${city}, ${country}`);

  return `https://www.expedia.com/Hotel-Search?destination=${destination}&startDate=${checkIn}&endDate=${checkOut}&rooms=${rooms}&adults=${guests}`;
};

/**
 * Generate Airbnb search URL
 */
export const generateAirbnbLink = (
  city: string,
  country: string,
  checkInDate: string | Date,
  checkOutDate: string | Date,
  guests: number = 2
): string => {
  const checkIn = formatDateForUrl(checkInDate);
  const checkOut = formatDateForUrl(checkOutDate);
  const destination = encodeURIComponent(`${city}, ${country}`);

  return `https://www.airbnb.com/s/${destination}/homes?checkin=${checkIn}&checkout=${checkOut}&adults=${guests}`;
};

// Booking link types
export interface FlightBookingLinks {
  googleFlights: string;
  skyscanner: string;
  kayak: string;
}

export interface HotelBookingLinks {
  bookingCom: string;
  hotelsCom: string;
  expedia: string;
  airbnb: string;
}

/**
 * Generate all flight booking links
 */
export const generateAllFlightLinks = (
  originCity: string,
  destinationCity: string,
  departureDate: string | Date,
  returnDate?: string | Date,
  passengers: number = 1,
  cabinClass: string = 'economy'
): FlightBookingLinks => {
  return {
    googleFlights: generateGoogleFlightsLink(originCity, destinationCity, departureDate, returnDate, passengers, cabinClass),
    skyscanner: generateSkyscannerLink(originCity, destinationCity, departureDate, returnDate, passengers, cabinClass),
    kayak: generateKayakLink(originCity, destinationCity, departureDate, returnDate, passengers, cabinClass),
  };
};

/**
 * Generate all hotel booking links
 */
export const generateAllHotelLinks = (
  city: string,
  country: string,
  checkInDate: string | Date,
  checkOutDate: string | Date,
  guests: number = 2,
  rooms: number = 1
): HotelBookingLinks => {
  return {
    bookingCom: generateBookingComLink(city, country, checkInDate, checkOutDate, guests, rooms),
    hotelsCom: generateHotelsComLink(city, country, checkInDate, checkOutDate, guests, rooms),
    expedia: generateExpediaLink(city, country, checkInDate, checkOutDate, guests, rooms),
    airbnb: generateAirbnbLink(city, country, checkInDate, checkOutDate, guests),
  };
};

// Real hotel data for common destinations with accurate info
export const realHotelsData: Record<string, Array<{
  name: string;
  address: string;
  rating: number;
  priceRange: { min: number; max: number };
  type: 'hotel' | 'apartment' | 'hostel';
  stars: number;
  amenities: string[];
  photo: string;
}>> = {
  'vienna': [
    {
      name: 'Wombats City Hostel Vienna - The Lounge',
      address: 'Mariahilfer Strasse 137, 1150 Vienna',
      rating: 8.5,
      priceRange: { min: 25, max: 45 },
      type: 'hostel',
      stars: 0,
      amenities: ['Free WiFi', 'Bar', '24h Reception', 'Luggage Storage'],
      photo: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
    },
    {
      name: 'Hotel Beethoven Wien',
      address: 'Papagenogasse 6, 1060 Vienna',
      rating: 8.8,
      priceRange: { min: 90, max: 150 },
      type: 'hotel',
      stars: 4,
      amenities: ['Free WiFi', 'Breakfast', 'Bar', 'Fitness Center'],
      photo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    },
    {
      name: 'Motel One Wien-Staatsoper',
      address: 'Elisabethstrasse 5, 1010 Vienna',
      rating: 8.6,
      priceRange: { min: 75, max: 120 },
      type: 'hotel',
      stars: 3,
      amenities: ['Free WiFi', 'Bar', 'Central Location'],
      photo: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
    },
    {
      name: 'Hotel Sacher Wien',
      address: 'Philharmonikerstrasse 4, 1010 Vienna',
      rating: 9.4,
      priceRange: { min: 350, max: 800 },
      type: 'hotel',
      stars: 5,
      amenities: ['Free WiFi', 'Spa', 'Restaurant', 'Concierge', 'Room Service'],
      photo: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400',
    },
  ],
  'london': [
    {
      name: 'Generator London',
      address: '37 Tavistock Pl, London WC1H 9SE',
      rating: 7.8,
      priceRange: { min: 20, max: 50 },
      type: 'hostel',
      stars: 0,
      amenities: ['Free WiFi', 'Bar', 'Social Events'],
      photo: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
    },
    {
      name: 'The Z Hotel Piccadilly',
      address: '17 Moor Street, Soho, London W1D 5AP',
      rating: 8.4,
      priceRange: { min: 80, max: 150 },
      type: 'hotel',
      stars: 3,
      amenities: ['Free WiFi', 'Cafe', 'Central Location'],
      photo: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
    },
  ],
  'paris': [
    {
      name: "Generator Paris",
      address: "9-11 Place du Colonel Fabien, 75010 Paris",
      rating: 8.0,
      priceRange: { min: 25, max: 60 },
      type: 'hostel',
      stars: 0,
      amenities: ['Free WiFi', 'Bar', 'Terrace'],
      photo: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
    },
    {
      name: 'Hotel Marignan Champs-Elysees',
      address: '12 Rue de Marignan, 75008 Paris',
      rating: 9.2,
      priceRange: { min: 280, max: 600 },
      type: 'hotel',
      stars: 5,
      amenities: ['Free WiFi', 'Spa', 'Restaurant', 'Fitness', 'Concierge'],
      photo: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400',
    },
  ],
};

// Real airline data
export const realAirlinesData = [
  { name: 'Ryanair', code: 'FR', type: 'low-cost' },
  { name: 'Wizz Air', code: 'W6', type: 'low-cost' },
  { name: 'EasyJet', code: 'U2', type: 'low-cost' },
  { name: 'Austrian Airlines', code: 'OS', type: 'full-service' },
  { name: 'Lufthansa', code: 'LH', type: 'full-service' },
  { name: 'British Airways', code: 'BA', type: 'full-service' },
  { name: 'Air France', code: 'AF', type: 'full-service' },
  { name: 'KLM', code: 'KL', type: 'full-service' },
  { name: 'Swiss', code: 'LX', type: 'full-service' },
];

// Estimated price ranges by route distance (km)
export const estimatePriceRange = (
  originCity: string,
  destinationCity: string,
  cabinClass: string = 'economy'
): { min: number; max: number } => {
  // Simple distance-based estimation
  const routePrices: Record<string, { min: number; max: number }> = {
    'tirana-vienna': { min: 50, max: 180 },
    'tirana-london': { min: 80, max: 250 },
    'tirana-paris': { min: 70, max: 220 },
    'london-paris': { min: 40, max: 150 },
    'london-vienna': { min: 60, max: 200 },
    'default-short': { min: 40, max: 150 },  // <500km
    'default-medium': { min: 80, max: 250 }, // 500-1500km
    'default-long': { min: 150, max: 500 },  // >1500km
  };

  const routeKey = `${originCity.toLowerCase()}-${destinationCity.toLowerCase()}`;
  const reverseKey = `${destinationCity.toLowerCase()}-${originCity.toLowerCase()}`;

  let basePrice = routePrices[routeKey] || routePrices[reverseKey] || routePrices['default-medium'];

  // Adjust for cabin class
  const classMultipliers: Record<string, number> = {
    'economy': 1,
    'premium_economy': 1.8,
    'business': 3.5,
    'first_class': 6,
  };

  const multiplier = classMultipliers[cabinClass] || 1;

  return {
    min: Math.round(basePrice.min * multiplier),
    max: Math.round(basePrice.max * multiplier),
  };
};
