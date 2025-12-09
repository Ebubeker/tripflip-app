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

    const origin = outboundSegments[0].departure.airport;
    const destination = outboundSegments[outboundSegments.length - 1].arrival.airport;
    const departureDate = outboundSegments[0].departure.time.split('T')[0].replace(/-/g, '');
    const returnDate = returnSegments ? returnSegments[0].departure.time.split('T')[0].replace(/-/g, '') : '';

    const bookingLink = `https://www.skyscanner.com/transport/flights/${origin}/${destination}/${departureDate}${returnDate ? '/' + returnDate : ''}/?adultsv2=1&cabinclass=economy&childrenv2=&ref=home&rtn=${returnDate ? '1' : '0'}&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false`;

    return {
      id: offer.id,
      totalPrice: parseFloat(offer.price.total),
      currency: offer.price.currency,
      outboundSegments,
      returnSegments,
      airline: offer.validatingAirlineCodes[0] || outboundSegments[0].carrier,
      bookingLink,
    };
  });
}

function getMockFlights(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string | null
): FlightOption[] {
  // Realistic airline data with actual European carriers and budget airlines
  const airlineData = [
    { code: "FR", name: "Ryanair", priceMultiplier: 0.5 },
    { code: "W6", name: "Wizz Air", priceMultiplier: 0.6 },
    { code: "U2", name: "easyJet", priceMultiplier: 0.7 },
    { code: "VY", name: "Vueling", priceMultiplier: 0.75 },
    { code: "LH", name: "Lufthansa", priceMultiplier: 1.3 },
    { code: "OS", name: "Austrian Airlines", priceMultiplier: 1.4 },
    { code: "TK", name: "Turkish Airlines", priceMultiplier: 1.1 },
  ];

  // Much more realistic base pricing
  // European short-haul one-way: €30-80 base, return: €60-150 base
  const isReturn = returnDate !== null;
  const basePrice = isReturn ? 70 + Math.random() * 80 : 35 + Math.random() * 45;

  return airlineData.map((airline, idx) => {
    // Add variation and airline multiplier
    const priceVariation = (Math.random() - 0.5) * 30;
    const price = basePrice * airline.priceMultiplier + priceVariation + (idx * 8);

    // Vary flight times realistically
    const depHour = 6 + (idx * 2) % 16; // Between 6am and 10pm
    const depMinute = Math.floor(Math.random() * 12) * 5; // 0, 5, 10, ..., 55
    const flightDuration = 2 + Math.random() * 2; // 2-4 hours
    const arrHour = depHour + Math.floor(flightDuration);
    const arrMinute = depMinute + Math.floor((flightDuration % 1) * 60);

    const departureTime = `${departureDate}T${depHour.toString().padStart(2, '0')}:${depMinute.toString().padStart(2, '0')}:00`;
    const arrivalTime = `${departureDate}T${(arrHour % 24).toString().padStart(2, '0')}:${(arrMinute % 60).toString().padStart(2, '0')}:00`;

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
        duration: `PT${Math.floor(flightDuration)}H${Math.floor((flightDuration % 1) * 60)}M`,
        carrier: airline.code,
        flightNumber: `${airline.code}${1000 + idx * 13}`,
      },
    ];

    let returnSegments: FlightSegment[] | undefined;
    if (returnDate) {
      const retDepHour = 8 + (idx * 2) % 14;
      const retDepMinute = Math.floor(Math.random() * 12) * 5;
      const retArrHour = retDepHour + Math.floor(flightDuration);
      const retArrMinute = retDepMinute + Math.floor((flightDuration % 1) * 60);

      const returnDepartureTime = `${returnDate}T${retDepHour.toString().padStart(2, '0')}:${retDepMinute.toString().padStart(2, '0')}:00`;
      const returnArrivalTime = `${returnDate}T${(retArrHour % 24).toString().padStart(2, '0')}:${(retArrMinute % 60).toString().padStart(2, '0')}:00`;

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
          duration: `PT${Math.floor(flightDuration)}H${Math.floor((flightDuration % 1) * 60)}M`,
          carrier: airline.code,
          flightNumber: `${airline.code}${2000 + idx * 13}`,
        },
      ];
    }

    // Generate Skyscanner deep link for booking
    const bookingLink = `https://www.skyscanner.com/transport/flights/${origin}/${destination}/${departureDate.replace(/-/g, '')}${returnDate ? '/' + returnDate.replace(/-/g, '') : ''}/?adultsv2=1&cabinclass=economy&childrenv2=&ref=home&rtn=${returnDate ? '1' : '0'}&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false`;

    return {
      id: `flight-${airline.code}-${idx}`,
      totalPrice: Math.round(price * 100) / 100,
      currency: "EUR",
      outboundSegments,
      returnSegments,
      airline: airline.name,
      bookingLink,
    };
  });
}
