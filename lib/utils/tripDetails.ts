import { Flight, Stay, TravelBookingResponse } from "@/type/recommendation";
import { useEffect, useState } from "react";

export interface BudgetResponse {
  maxBudget: number;
  currentSpent: number;
  currency: string;
  aiRecommendationPrice?: number;
}

export const useGetBudgetDetails = (
  flights: Flight[],
  stays: Stay[],
  budget: number,
  recommendations?: TravelBookingResponse
) => {
  const [spent, setSpent] = useState(0);
  const [recommendedSpent, setRecommendedSpent] = useState(0);

  useEffect(() => {
    console.log("Price is updating")
    let currentSpent = 0;
    let recomSpent = 0;

    if (flights.length) {
      flights.forEach((flight) => {
        currentSpent += flight.price;
      });
    }
    if (stays.length) {
      stays.forEach((stay) => {
        currentSpent += findTotalPrice(
          stay.price_per_night ? stay.price_per_night : 0,
          stay.check_in_date,
          stay.check_out_date
        );
      });
    }

    if (recommendations) {
      if (!flights.length) {
        recomSpent += recommendations.recommended_outbound_flight
          ? recommendations.recommended_outbound_flight.price
          : 0;
        recomSpent += recommendations.recommended_return_flight
          ? recommendations.recommended_return_flight.price
          : 0;
      }

      if (
        flights.length === 1 &&
        !flights.some((flight: Flight) => flight.is_return_flight)
      ) {
        recomSpent += recommendations.recommended_return_flight
          ? recommendations.recommended_return_flight.price
          : 0;
      } else if (
        flights.length === 1 &&
        flights.some((flight: Flight) => flight.is_return_flight)
      ) {
        recomSpent += recommendations.recommended_outbound_flight ? recommendations.recommended_outbound_flight.price : 0;
      }

      if (!stays.length) {
        if(recommendations.recommended_hotel){
          recomSpent += findTotalPrice(
            recommendations.recommended_hotel ? recommendations.recommended_hotel.price_per_night : 0,
            recommendations.recommended_hotel.check_in_date,
            recommendations.recommended_hotel.check_out_date
          )
        } 
      }
    }
    setRecommendedSpent(recomSpent);
    setSpent(currentSpent);
  }, [flights, stays, budget, recommendations]);

  return {
    maxBudget: budget ? budget : 0,
    currentSpent: Math.round(spent * 100) / 100,
    currency:
      flights.length > 0 ? flights[0].currency : stays[0]?.currency || "USD",
    aiRecommendationPrice: recommendations
      ? Math.round(recommendedSpent * 100) / 100
      : undefined,
  };
};

export const findTotalPrice = (
  price: number,
  startDate: string,
  endDate: string
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const total = price * daysDiff;
  return Math.round(total * 100) / 100;
};
