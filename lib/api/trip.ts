import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "../supabase";

export interface Trip {
  id: string;
  name: string;
  countries: string[];
  start_date: string;
  end_date: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const insertTrip = async (
  tripData: Omit<Trip, "id" | "created_at" | "updated_at">
) => {
  const { data, error } = await supabase
    .from("trips")
    .insert([
      {
        name: tripData.name,
        countries: tripData.countries,
        start_date: tripData.start_date,
        end_date: tripData.end_date,
        user_id: tripData.user_id,
      },
    ])
    .select();

  if (error) {
    console.error("Error inserting trip:", error);
    return { data: null, error };
  }

  return { data, error: null };
};

export const formatTripForDatabase = (
  tripName: string,
  selectedItems: string[],
  startDate: Date,
  endDate: Date,
  userId: string
): Omit<Trip, "id" | "created_at" | "updated_at"> => {
  return {
    name: tripName,
    countries: selectedItems,
    start_date: startDate.toISOString().split("T")[0],
    end_date: endDate.toISOString().split("T")[0],
    user_id: userId,
  };
};

export const insertFlight = async (
  tripId: string,
  flightNumber?: string,
  price: string,
  fromAirport: string,
  toAirport: string,
  startDate: Date,
  endDate: Date
) => {
  console.log(tripId)
  const { data, error } = await supabase.from("flights").insert({
    id: uuidv4(),
    trip_id: tripId,
    flight_number: flightNumber ? flightNumber : undefined,
    price: price,
    origin_airport: fromAirport,
    destination_airport: toAirport,
    departure_date: startDate.toISOString(),
    arrival_date: endDate.toISOString(),
  });

  if (error) {
    console.error("Error inserting flights:", error);
    return { data: null, error };
  }

  return { data, error: null };
};

export const getAllFlightsByTripId = async (tripId: string) => {
  const { data, error } = await supabase
    .from("flights")
    .select("*")
    .eq("trip_id", tripId);

  if (error) {
    console.error("Error fetching flights:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export const insertStay = async (
  tripId: string,
  hotelName: string,
  price: string,
  fromDate: Date,
  toDate: Date,
  address?: string
) => {
  const { data, error } = await supabase.from("stays").insert({
    id: uuidv4(),
    trip_id: tripId,
    name: hotelName,
    price_per_night: price,
    check_in_date: fromDate.toISOString(),
    check_out_date: toDate.toISOString(),
    address: address ? address : undefined,
  });

  if (error) {
    console.error("Error inserting stay:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export const getAllStaysByTripId = async (tripId: string) => {
  const { data, error } = await supabase
    .from("stays")
    .select("*")
    .eq("trip_id", tripId);

  if (error) {
    console.error("Error fetching stays:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export const insertPlace = async (
  tripId: string,
  name: string,
  type: string,
  address: string,
  visitDate?: Date,
  cost?: string
) => {
  const { data, error } = await supabase.from("places_to_visit").insert({
    id: uuidv4(),
    trip_id: tripId,
    name,
    type,
    address,
    visit_date: visitDate,
    estimated_cost: cost ? parseFloat(cost) : undefined
  });

  if (error) {
    console.error("Error inserting place:", error);
    return { data: null, error };
  }

  return { data, error: null };
}