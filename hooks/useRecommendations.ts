import { fetchRecommendations } from "@/lib/api/get_recomendations";
import { Flight, TravelBookingResponse } from "@/type/recommendation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "./useUser";

interface RecommendationParams {
  destination_city: string;
  destination_country: string;
  budget: number;
  dates_start: Date;
  dates_end: Date;
  // current_city: string;
  // current_country: string;
  travel_style: string;
  travel_interests: string;
}

export const useRecommendations = (
  recData: RecommendationParams,
  fetch: boolean = true
) => {
  const [loading, setLoading] = useState(false);
  const [inboundFlight, setInboundFlight] = useState<Flight[] | undefined>(
    undefined
  );
  const [returnFlight, setReturnFlight] = useState<Flight[] | undefined>(
    undefined
  );
  const [recommendations, setRecommendations] = useState<
    TravelBookingResponse | undefined
  >(undefined);

  const { user } = useUser();

  const dataKey = useMemo(() => {
    return {
      destination_city: recData.destination_city,
      destination_country: recData.destination_country,
      budget: recData.budget,
      dates_start: recData.dates_start?.toISOString?.() || recData.dates_start,
      dates_end: recData.dates_end?.toISOString?.() || recData.dates_end,
      current_city: user?.city,
      current_country: (user ? JSON.parse(user.country)[0] : "").toLowerCase(),
      travel_style: recData.travel_style,
      travel_interests: recData.travel_interests,
    };
  }, [recData, user]);

  const fetchData = useCallback(async () => {
    if (!fetch) return;

    setLoading(true);
    try {
      const rec = await fetchRecommendations(dataKey);
      console.log(rec);
      setRecommendations(rec.data as TravelBookingResponse);
      setReturnFlight(
        rec.data.flights.filter((flight: Flight) => flight.is_return_flight)
      );
      setInboundFlight(
        rec.data.flights.filter((flight: Flight) => !flight.is_return_flight)
      );
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  }, [user, fetch]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [fetchData]);

  const checkFailed = useMemo(() => {
    if (loading) return false;

    if (!recommendations) return true;

    if (
      !recommendations?.recommended_hotel ||
      !recommendations.stays ||
      !recommendations.flights ||
      !recommendations.recommended_outbound_flight ||
      !recommendations.recommended_return_flight
    )
      return true;

    if (!recommendations.stays[0].price_per_night) return true;

    return false;
  }, [recommendations, loading]);

  return {
    inboundFlight,
    returnFlight,
    recommendations,
    loading,
    refetch: fetchData,
    failed: checkFailed,
  };
};
