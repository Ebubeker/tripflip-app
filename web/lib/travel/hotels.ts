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

  const hotelNames = [
    "Grand Plaza Hotel",
    "City Center Inn",
    "Luxury Suites Downtown",
    "Budget Stay Hotel",
    "Premium Resort & Spa",
  ];

  const locations = [
    "Downtown",
    "City Center",
    "Airport Area",
    "Beach Front",
    "Historic District",
  ];

  return hotelNames.map((name, idx) => {
    const rating = 3 + idx * 0.5;
    const basePricePerNight = 80 + idx * 40 + Math.random() * 50;
    const pricePerNight = Math.round(basePricePerNight * 100) / 100;
    const totalPrice = Math.round(pricePerNight * nights * 100) / 100;

    return {
      id: `hotel-${idx}`,
      name,
      pricePerNight,
      totalPrice,
      currency: "USD",
      rating,
      location: `${locations[idx]}, ${destination}`,
      imageUrl: `https://images.unsplash.com/photo-${1566073000000 + idx}?w=400`,
      description: `A ${rating}-star hotel in ${locations[idx]}`,
    };
  });
}
