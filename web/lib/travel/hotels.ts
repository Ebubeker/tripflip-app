import { HotelOption } from "../types";

export async function searchHotels(
  destination: string,
  checkIn: string,
  checkOut: string,
  adults: number
): Promise<HotelOption[]> {
  // Check if API is configured
  const useRealAPI = process.env.HOTELBEDS_API_KEY && process.env.HOTELBEDS_API_SECRET;

  if (!useRealAPI) {
    console.log("Using mock hotel data (Hotelbeds API not configured)");
    return getMockHotels(destination, checkIn, checkOut);
  }

  try {
    // Hotelbeds API implementation would go here
    // For now, we'll use mock data as the actual implementation
    // requires more complex setup with destination codes, etc.
    return getMockHotels(destination, checkIn, checkOut);
  } catch (error) {
    console.error("Error fetching hotels, using mock data:", error);
    return getMockHotels(destination, checkIn, checkOut);
  }
}

function getMockHotels(
  destination: string,
  checkIn: string,
  checkOut: string
): HotelOption[] {
  // Calculate number of nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Real hotel chains and types with realistic pricing
  const hotelData = [
    {
      name: "Ibis Budget",
      rating: 2,
      priceMultiplier: 0.6,
      type: "Budget",
      unsplashId: "1566073112211",
    },
    {
      name: "Premier Inn",
      rating: 3,
      priceMultiplier: 0.8,
      type: "Economy",
      unsplashId: "1566665344121",
    },
    {
      name: "Holiday Inn Express",
      rating: 3,
      priceMultiplier: 0.9,
      type: "Mid-Range",
      unsplashId: "1611892440504",
    },
    {
      name: "Novotel",
      rating: 4,
      priceMultiplier: 1.2,
      type: "Upper Mid-Range",
      unsplashId: "1618773928121",
    },
    {
      name: "Hilton Garden Inn",
      rating: 4,
      priceMultiplier: 1.4,
      type: "Upscale",
      unsplashId: "1582719478250",
    },
    {
      name: "Marriott",
      rating: 4,
      priceMultiplier: 1.6,
      type: "Upscale",
      unsplashId: "1584132967334",
    },
    {
      name: "InterContinental",
      rating: 5,
      priceMultiplier: 2.2,
      type: "Luxury",
      unsplashId: "1542314831-068cd1dbfeeb",
    },
  ];

  const locations = [
    "City Center",
    "Old Town",
    "Central Station District",
    "Downtown",
    "Historic Quarter",
    "Business District",
    "Near Main Square",
  ];

  // Base price per night in EUR (realistic for European cities)
  const basePrice = 55 + Math.random() * 25; // €55-80 base

  return hotelData.map((hotel, idx) => {
    const priceVariation = (Math.random() - 0.5) * 15;
    const pricePerNight = Math.round((basePrice * hotel.priceMultiplier + priceVariation) * 100) / 100;
    const totalPrice = Math.round(pricePerNight * nights * 100) / 100;

    const location = locations[idx % locations.length];
    const hotelName = `${hotel.name} ${destination}`;

    // Generate Booking.com-style search link
    const checkInFormatted = checkIn;
    const checkOutFormatted = checkOut;
    const bookingLink = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}&checkin=${checkInFormatted}&checkout=${checkOutFormatted}&group_adults=2&no_rooms=1&group_children=0`;

    // Use real hotel images from Unsplash
    const imageUrl = `https://images.unsplash.com/photo-${hotel.unsplashId}?w=800&h=600&fit=crop&q=80`;

    return {
      id: `hotel-${idx}`,
      name: hotelName,
      pricePerNight,
      totalPrice,
      currency: "EUR",
      rating: hotel.rating,
      location: `${location}, ${destination}`,
      imageUrl,
      description: `${hotel.type} ${hotel.rating}-star hotel in ${location}. Popular choice for travelers seeking ${hotel.type.toLowerCase()} accommodations.`,
      bookingLink,
    };
  });
}
