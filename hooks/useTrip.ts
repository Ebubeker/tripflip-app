import { Trip } from "@/lib/api/trip";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

async function getUpcomingTravelItem(tripId: string) {
  try {
    const currentDateTime = new Date();
    const currentDate = currentDateTime.toISOString().split("T")[0];
    const currentTime = currentDateTime.toTimeString().split(" ")[0];

    const { data: outboundFlight, error: flightError } = await supabase
      .from("flights")
      .select("*")
      .eq("trip_id", tripId)
      .eq("is_return_flight", false)
      // .eq('status', 'available')
      .or(
        `departure_date.gt.${currentDate},and(departure_date.eq.${currentDate},departure_time.gt.${currentTime})`
      )
      .order("departure_date", { ascending: true })
      .order("departure_time", { ascending: true })
      .limit(1)
      .single();

    if (flightError && flightError.code !== "PGRST116") {
      console.error("Error fetching outbound flight:", flightError);
    }

    if (outboundFlight) {
      return {
        ...outboundFlight,
        item_type: "flight",
        datetime: `${outboundFlight.departure_date} ${outboundFlight.departure_time}`,
        priority: 1,
        description: `${outboundFlight.airline} ${outboundFlight.flight_number} - ${outboundFlight.origin_city} to ${outboundFlight.destination_city}`,
      };
    }

    const { data: stay, error: stayError } = await supabase
      .from("stays")
      .select("*")
      .eq("trip_id", tripId)
      // .eq('status', 'available')
      .or(
        `check_in_date.gt.${currentDate},and(check_in_date.eq.${currentDate},check_in_time.gt.${currentTime})`
      )
      .order("check_in_date", { ascending: true })
      .order("check_in_time", { ascending: true })
      .limit(1)
      .single();

    if (stayError && stayError.code !== "PGRST116") {
      console.error("Error fetching stay:", stayError);
    }

    if (stay) {
      return {
        ...stay,
        item_type: "stay",
        datetime: `${stay.check_in_date} ${stay.check_in_time}`,
        priority: 2,
        description: `${stay.name} - ${stay.city}, ${stay.country}`,
      };
    }

    const { data: returnFlight, error: returnFlightError } = await supabase
      .from("flights")
      .select("*")
      .eq("trip_id", tripId)
      .eq("is_return_flight", true)
      // .eq('status', 'available')
      .or(
        `departure_date.gt.${currentDate},and(departure_date.eq.${currentDate},departure_time.gt.${currentTime})`
      )
      .order("departure_date", { ascending: true })
      .order("departure_time", { ascending: true })
      .limit(1)
      .single();

    if (returnFlightError && returnFlightError.code !== "PGRST116") {
      console.error("Error fetching return flight:", returnFlightError);
    }

    if (returnFlight) {
      return {
        ...returnFlight,
        item_type: "flight",
        datetime: `${returnFlight.departure_date} ${returnFlight.departure_time}`,
        priority: 3,
        description: `${returnFlight.airline} ${returnFlight.flight_number} - ${returnFlight.origin_city} to ${returnFlight.destination_city}`,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting upcoming travel item:", error);
    throw error;
  }
}

export const useTrip = (userId: string) => {
  const [trips, setTrips] = useState<undefined | any>(undefined);
  const [latestTrip, setLatestTrip] = useState<undefined | any>(undefined);
  const [upCommingTripItem, setUpCommingTripItem] = useState<undefined | any>(
    undefined
  );
  const [loading, setLoading] = useState<undefined | any>(undefined);

  const getTrips = () => {
    setLoading(true);
    try {
      supabase
        .from("trips")
        .select("*")
        .eq("user_id", userId)
        .then((trips) => {
          const now = new Date();
          setTrips(trips.data ? trips.data : undefined);

          const upcomingEvents = trips.data
            ? trips.data
                .map((event) => ({
                  ...event,
                  start: new Date(event.start_date),
                }))
                .filter((event) => event.start > now)
                .sort((a, b) => a.start.getTime() - b.start.getTime())
            : [];

          getUpcomingTravelItem(upcomingEvents[0].id).then((travelItems) => {
            if (travelItems) {
              setUpCommingTripItem(travelItems);
            } else {
              setUpCommingTripItem(undefined);
            }
          });

          setLatestTrip(upcomingEvents.length ? upcomingEvents[0] : undefined);
          setLoading(false);
        })
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && !(userId === "")) {
      getTrips();
    }
  }, []);

  return {
    trips,
    latestTrip,
    upCommingTripItem,
    loading,
    refetch: getTrips,
  };
};

export const useGetTripById = (tripId: string) => {
  const [trip, setTrip] = useState<undefined | Trip>(undefined);
  const [loading, setLoading] = useState<undefined | any>(undefined);

  const getTripById = () => {
    setLoading(true);
    try {
      supabase
        .from("trips")
        .select("*")
        .eq("id", tripId)
        .single()
        .then((trip) => {
          // console.log(trip.data)
          setTrip(trip.data ? trip.data : undefined);
          setLoading(false);
        });
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  };

  const updateTripById = (updatedTrip: Omit<Trip, "id" | "created_at" | "updated_at">): Promise<any> => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      
      supabase
        .from("trips")
        .update(updatedTrip)
        .eq("id", tripId)
        .select()
        .then((response) => {
          setLoading(false);
          
          if (response.error) {
            console.error("Error updating trip:", response.error);
            reject(response.error);
          } else {
            const updatedTrip = response.data ? response.data[0] : undefined;
            setTrip(updatedTrip);
            resolve(updatedTrip);
          }
        })
    });
  };

  useEffect(() => {
    getTripById();
  }, [tripId]);

  return {
    trip,
    loading,
    refetch: getTripById,
    updateTripById
  };
};

export const useGetFlightsByTripId = (tripId: string) => {
  const [flights, setFlights] = useState<undefined | any>(undefined);
  const [loading, setLoading] = useState<undefined | any>(undefined);

  const getFlightsByTripId = () => {
    setLoading(true);
    try {
      supabase
        .from("flights")
        .select("*")
        .eq("trip_id", tripId)
        .then((flights) => {
          setFlights(flights.data ? flights.data : undefined);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFlightsByTripId();
  }, [tripId]);

  return {
    flights,
    loading,
    refetch: getFlightsByTripId,
  };
};

export const useGetStaysByTripId = (tripId: string) => {
  const [stays, setStays] = useState<undefined | any>(undefined);
  const [loading, setLoading] = useState<undefined | any>(undefined);

  const getStaysByTripId = () => {
    setLoading(true);
    try {
      supabase
        .from("stays")
        .select("*")
        .eq("trip_id", tripId)
        .then((stays) => {
          setStays(stays.data ? stays.data : undefined);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStaysByTripId();
  }, [tripId]);

  return {
    stays,
    loading,
    refetch: getStaysByTripId,
  };
};

export const useGetPlacesByTripId = (tripId: string) => {
  const [places, setPlaces] = useState<undefined | any>(undefined);
  const [loading, setLoading] = useState<undefined | any>(undefined);

  const getPlacesByTripId = () => {
    setLoading(true);
    try {
      supabase
        .from("places_to_visit")
        .select("*")
        .eq("trip_id", tripId)
        .then((places) => {
          setPlaces(places.data ? places.data : undefined);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlacesByTripId();
  }, [tripId]);

  return {
    placesVisit: places,
    loading,
    refetch: getPlacesByTripId,
  };
};
