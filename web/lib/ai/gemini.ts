import { GoogleGenerativeAI } from "@google/generative-ai";
import { TripPackage, AISummary } from "../types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateTripSummary(
  packages: TripPackage[],
  origin: string,
  destination: string,
  dateRange: string,
  budget?: number
): Promise<AISummary> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const packagesData = packages.map((pkg, idx) => ({
      id: pkg.id,
      index: idx + 1,
      totalPrice: `${pkg.totalPrice} ${pkg.currency}`,
      pricePerPerson: `${pkg.pricePerPerson} ${pkg.currency}`,
      airline: pkg.flight.airline,
      outboundDeparture: pkg.flight.outboundSegments[0]?.departure.time,
      outboundArrival:
        pkg.flight.outboundSegments[pkg.flight.outboundSegments.length - 1]
          ?.arrival.time,
      returnDeparture: pkg.flight.returnSegments?.[0]?.departure.time,
      returnArrival:
        pkg.flight.returnSegments?.[
          pkg.flight.returnSegments.length - 1
        ]?.arrival.time,
      hotelName: pkg.hotel.name,
      hotelRating: pkg.hotel.rating,
      hotelPricePerNight: `${pkg.hotel.pricePerNight} ${pkg.hotel.currency}`,
      hotelLocation: pkg.hotel.location,
    }));

    const prompt = `You are a travel assistant that explains options clearly and realistically. You never invent prices. You only work with the data you receive.

Here are candidate trip packages for a trip from ${origin} to ${destination} for ${dateRange}.
${budget ? `The user's budget is ${budget}.` : "No specific budget was provided."}

Available packages:
${JSON.stringify(packagesData, null, 2)}

Please:
1. Pick up to 5 best options from these packages
2. For each option, explain why it's a good choice in 1-2 sentences
3. Categorize each as one of: "Cheapest", "Best Value", or "Most Comfortable"
4. Provide a brief overall summary (2-3 sentences) of the trip options

Return your response in JSON format with this structure:
{
  "overview": "Brief overall summary",
  "recommendations": [
    {
      "packageId": "package ID from the data",
      "type": "Cheapest" | "Best Value" | "Most Comfortable",
      "explanation": "Why this is a good choice"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from markdown code blocks if present
    let jsonText = text;
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    } else {
      // Try to find JSON object in the text
      const objectMatch = text.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        jsonText = objectMatch[0];
      }
    }

    const aiResponse = JSON.parse(jsonText);

    return {
      overview: aiResponse.overview,
      recommendations: aiResponse.recommendations.map((rec: any) => ({
        packageId: rec.packageId,
        type: rec.type,
        explanation: rec.explanation,
      })),
    };
  } catch (error) {
    console.error("Error generating AI summary:", error);
    // Return a fallback response
    return {
      overview:
        "We found several trip options for you. Compare prices and travel times to find the best fit.",
      recommendations: packages.slice(0, 3).map((pkg, idx) => ({
        packageId: pkg.id,
        type: (idx === 0
          ? "Cheapest"
          : idx === 1
          ? "Best Value"
          : "Most Comfortable") as "Cheapest" | "Best Value" | "Most Comfortable",
        explanation: `This package offers ${pkg.flight.airline} flights and ${pkg.hotel.name} for ${pkg.totalPrice} ${pkg.currency}.`,
      })),
    };
  }
}
