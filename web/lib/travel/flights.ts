import { FlightOption, FlightSegment } from "../types";

// Amadeus API authentication
let amadeusToken: string | null = null;
let tokenExpiry: number = 0;

async function getAmadeusToken(): Promise<string> {
  if (amadeusToken && Date.now() < tokenExpiry) {
    return amadeusToken;
  }

  const apiKey = process.env.AMADEUS_API_KEY;
  const apiSecret = process.env.AMADEUS_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("Amadeus API credentials not configured");
  }

  const response = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: apiKey,
        client_secret: apiSecret,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to authenticate with Amadeus API");
  }

  const data = await response.json();
  amadeusToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000 - 60000; // Subtract 1 minute for safety

  if (!amadeusToken) {
    throw new Error("Failed to get access token from Amadeus");
  }

  return amadeusToken;
}

export async function searchFlights(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string | null,
  adults: number
): Promise<FlightOption[]> {
  // Check if API is configured
  const useRealAPI =
    process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET;

  if (!useRealAPI) {
    console.log("Using mock flight data (Amadeus API not configured)");
    return getMockFlights(origin, destination, departureDate, returnDate);
  }

  try {
    const token = await getAmadeusToken();

    const params = new URLSearchParams({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: adults.toString(),
      max: "10",
      currencyCode: "USD",
    });

    if (returnDate) {
      params.append("returnDate", returnDate);
    }

    const response = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch flights from Amadeus");
    }

    const data = await response.json();
    return mapAmadeusFlights(data.data);
  } catch (error) {
    console.error("Error fetching flights from Amadeus, using mock data:", error);
    return getMockFlights(origin, destination, departureDate, returnDate);
  }
}

function mapAmadeusFlights(amadeusData: any[]): FlightOption[] {
  return amadeusData.map((offer) => {
    const outboundSegments: FlightSegment[] = offer.itineraries[0].segments.map(
      (seg: any) => ({
        departure: {
          airport: seg.departure.iataCode,
          time: seg.departure.at,
        },
        arrival: {
          airport: seg.arrival.iataCode,
          time: seg.arrival.at,
        },
        duration: seg.duration,
        carrier: seg.carrierCode,
        flightNumber: seg.number,
      })
    );

    const returnSegments: FlightSegment[] | undefined =
      offer.itineraries[1]?.segments.map((seg: any) => ({
        departure: {
          airport: seg.departure.iataCode,
          time: seg.departure.at,
        },
        arrival: {
          airport: seg.arrival.iataCode,
          time: seg.arrival.at,
        },
        duration: seg.duration,
        carrier: seg.carrierCode,
        flightNumber: seg.number,
      }));

    return {
      id: offer.id,
      totalPrice: parseFloat(offer.price.total),
      currency: offer.price.currency,
      outboundSegments,
      returnSegments,
      airline: offer.validatingAirlineCodes[0] || outboundSegments[0].carrier,
    };
  });
}

function getMockFlights(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string | null
): FlightOption[] {
  const airlines = ["AA", "DL", "UA", "BA", "LH"];
  const basePrice = 300 + Math.random() * 500;

  return airlines.slice(0, 5).map((airline, idx) => {
    const price = basePrice + idx * 50 + Math.random() * 100;
    const departureTime = `${departureDate}T${8 + idx * 2}:00:00`;
    const arrivalTime = `${departureDate}T${14 + idx * 2}:00:00`;

    const outboundSegments: FlightSegment[] = [
      {
        departure: {
          airport: origin,
          time: departureTime,
        },
        arrival: {
          airport: destination,
          time: arrivalTime,
        },
        duration: "PT6H",
        carrier: airline,
        flightNumber: `${100 + idx}`,
      },
    ];

    let returnSegments: FlightSegment[] | undefined;
    if (returnDate) {
      const returnDepartureTime = `${returnDate}T${10 + idx * 2}:00:00`;
      const returnArrivalTime = `${returnDate}T${16 + idx * 2}:00:00`;

      returnSegments = [
        {
          departure: {
            airport: destination,
            time: returnDepartureTime,
          },
          arrival: {
            airport: origin,
            time: returnArrivalTime,
          },
          duration: "PT6H",
          carrier: airline,
          flightNumber: `${200 + idx}`,
        },
      ];
    }

    return {
      id: `flight-${airline}-${idx}`,
      totalPrice: Math.round(price * 100) / 100,
      currency: "USD",
      outboundSegments,
      returnSegments,
      airline,
    };
  });
}
