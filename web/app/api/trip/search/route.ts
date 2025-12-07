import { NextRequest, NextResponse } from "next/server";
import { searchFlights } from "@/lib/travel/flights";
import { searchHotels } from "@/lib/travel/hotels";
import { generateTripSummary } from "@/lib/ai/gemini";
import {
  TripSearchRequest,
  TripPackage,
  TripSearchResponse,
  AISummary,
} from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: TripSearchRequest = await request.json();

    // Validate required fields
    if (!body.origin || !body.destination || !body.startDate) {
      return NextResponse.json(
        { error: "Missing required fields: origin, destination, or startDate" },
        { status: 400 }
      );
    }

    // Calculate end date if nights are provided
    let endDate = body.endDate;
    if (!endDate && body.nights) {
      const startDate = new Date(body.startDate);
      const endDateObj = new Date(startDate);
      endDateObj.setDate(startDate.getDate() + body.nights);
      endDate = endDateObj.toISOString().split("T")[0];
    }

    if (!endDate) {
      return NextResponse.json(
        { error: "Either endDate or nights must be provided" },
        { status: 400 }
      );
    }

    // Prepare dates for API calls
    const returnDate = body.oneWay ? null : endDate;

    // Fetch flights and hotels in parallel
    const [flights, hotels] = await Promise.all([
      searchFlights(
        body.origin,
        body.destination,
        body.startDate,
        returnDate,
        body.adults
      ),
      searchHotels(body.destination, body.startDate, endDate, body.adults),
    ]);

    if (flights.length === 0 || hotels.length === 0) {
      return NextResponse.json(
        { error: "No flights or hotels found for this search" },
        { status: 404 }
      );
    }

    // Build packages by combining flights and hotels
    const packages = buildPackages(flights, hotels, body.adults, body.budget);

    if (packages.length === 0) {
      return NextResponse.json(
        { error: "No suitable packages found within your criteria" },
        { status: 404 }
      );
    }

    // Generate AI summary
    let aiSummary: AISummary | undefined;
    try {
      const dateRange = returnDate
        ? `${body.startDate} to ${returnDate}`
        : `starting ${body.startDate}`;
      aiSummary = await generateTripSummary(
        packages,
        body.origin,
        body.destination,
        dateRange,
        body.budget
      );

      // Update packages with AI recommendations
      packages.forEach((pkg) => {
        const recommendation = aiSummary?.recommendations.find(
          (rec) => rec.packageId === pkg.id
        );
        if (recommendation) {
          pkg.recommendationType = recommendation.type;
        }
      });
    } catch (error) {
      console.error("Error generating AI summary:", error);
      // Continue without AI summary
    }

    const response: TripSearchResponse = {
      packages,
      aiSummary,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error processing trip search:", error);
    return NextResponse.json(
      { error: "Internal server error while processing your search" },
      { status: 500 }
    );
  }
}

function buildPackages(
  flights: any[],
  hotels: any[],
  adults: number,
  budget?: number
): TripPackage[] {
  const packages: TripPackage[] = [];

  // Combine top flights with top hotels
  const topFlights = flights.slice(0, 5);
  const topHotels = hotels.slice(0, 5);

  for (const flight of topFlights) {
    for (const hotel of topHotels) {
      const totalPrice = flight.totalPrice + hotel.totalPrice;
      const pricePerPerson = totalPrice / adults;

      // Skip if over budget (if budget is specified)
      if (budget && totalPrice > budget) {
        continue;
      }

      packages.push({
        id: `${flight.id}-${hotel.id}`,
        flight,
        hotel,
        totalPrice: Math.round(totalPrice * 100) / 100,
        pricePerPerson: Math.round(pricePerPerson * 100) / 100,
        currency: flight.currency,
      });
    }
  }

  // Sort by total price and return top packages
  packages.sort((a, b) => a.totalPrice - b.totalPrice);

  // Return a mix of cheap, mid-range, and expensive options
  const cheapest = packages.slice(0, 5);
  const midRange = packages.slice(
    Math.floor(packages.length / 3),
    Math.floor(packages.length / 3) + 3
  );
  const premium = packages.slice(-3);

  const finalPackages = [...cheapest, ...midRange, ...premium];

  // Remove duplicates by id
  const uniquePackages = Array.from(
    new Map(finalPackages.map((pkg) => [pkg.id, pkg])).values()
  );

  return uniquePackages.slice(0, 10); // Return max 10 packages
}
