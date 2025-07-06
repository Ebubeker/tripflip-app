import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export const useTrip = (userId: string) => {
  const [trips, setTrips] = useState<undefined | any>(undefined);
  const [loading, setLoading] = useState<undefined | any>(undefined);

  const getTrips = () => {
    setLoading(true);
    try {
      supabase
        .from("trips")
        .select("*")
        .eq("user_id", userId)
        .then((trips) => {
          setTrips(trips.data ? trips.data : undefined);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTrips();
  }, []);

  return {
    trips,
    loading,
    refetch: getTrips,
  };
};

export const useGetTripById = (tripId: string) => {
  const [trip, setTrip] = useState<undefined | any>(undefined);
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
          setTrip(trip.data ? trip.data : undefined);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTripById();
  }, []);

  return {
    trip,
    loading,
    refetch: getTripById,
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
  }, []);

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
  }, []);

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
  }, []);

  return {
    placesVisit: places,
    loading,
    refetch: getPlacesByTripId,
  };
}