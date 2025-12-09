import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../supabase";

export interface Trip {
  id: string;
  name: string;
  destination_city: string;
  countries: string[];
  start_date: string;
  end_date: string;
  user_id: string;
  passengers: number;
  selected_class: string;
  selected_images: string;
  budget?: number;
  budget_currency?: string;
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
        destination_city: tripData.destination_city,
        countries: tripData.countries,
        start_date: tripData.start_date,
        end_date: tripData.end_date,
        user_id: tripData.user_id,
        passengers: tripData.passengers,
        selected_class: tripData.selected_class,
        selected_images: tripData.selected_images,
        budget: tripData.budget || null,
        budget_currency: tripData.budget_currency || 'USD',
      },
    ])
    .select();

  if (error) {
    console.error("Error inserting trip:", error);
    return { data: null, error };
  }

  return { data, error: null };
};

export const removeTrip = async (tripId: string) => {
  const { data: flightsData, error: flightsError } = await supabase
    .from("flights")
    .delete()
    .eq("trip_id", tripId)
    .select();

  if (flightsError) {
    console.error("Error deleting flights:", flightsError);
    return { data: null, error: flightsError };
  }

  const { data: staysData, error: staysError } = await supabase
    .from("stays")
    .delete()
    .eq("trip_id", tripId)
    .select();

  if (staysError) {
    console.error("Error deleting stays:", staysError);
    return { data: null, error: staysError };
  }

  const { data, error } = await supabase
    .from("trips")
    .delete()
    .eq("id", tripId)
    .select();

  if (error) {
    console.error("Error deleting trip:", error);
    return { data: null, error };
  }

  return { data, error: null };
};

export const removeTripItem = async (
  itemType: "flights" | "stays" | "places_to_visit",
  itemId: string
) => {
  const { data, error } = await supabase
    .from(itemType)
    .delete()
    .eq("id", itemId)
    .select();

  if (error) {
    console.error(`Error deleting ${itemType}:`, error);
    return { data: null, error };
  }

  return { data, error: null };
};

export const formatTripForDatabase = (
  tripName: string,
  destination_city: string,
  selectedItems: string[],
  startDate: Date,
  endDate: Date,
  userId: string,
  passengers: number,
  selectedClass: string,
  selectedImages: string,
  budget?: number,
  budgetCurrency?: string
): Omit<Trip, "id" | "created_at" | "updated_at"> => {
  return {
    name: tripName,
    destination_city,
    countries: selectedItems,
    start_date: startDate.toISOString().split("T")[0],
    end_date: endDate.toISOString().split("T")[0],
    user_id: userId,
    passengers: passengers,
    selected_class: selectedClass,
    selected_images: selectedImages,
    budget: budget,
    budget_currency: budgetCurrency || 'USD',
  };
};

export const insertFlight = async (
  tripId: string,
  flightNumber: string | undefined,
  price: string,
  fromAirport: string,
  toAirport: string,
  startDate: Date,
  endDate: Date
) => {
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
};

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
};

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
};

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
    estimated_cost: cost ? parseFloat(cost) : undefined,
  });

  if (error) {
    console.error("Error inserting place:", error);
    return { data: null, error };
  }

  return { data, error: null };
};

type StayInfo = {
  check_in_date: string
  check_out_date: string
  price_per_night: number
}

function getTotalPrice(stay: StayInfo): number {
  const checkIn = new Date(stay.check_in_date)
  const checkOut = new Date(stay.check_out_date)

  const nights =
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)

  return nights * stay.price_per_night
}

export const getTripBudget = async (tripId: string) => {
  const { data: flights, error: flightsError } = await supabase
    .from("flights")
    .select("price")
    .eq("trip_id", tripId);

  if (flightsError) {
    console.error("Error fetching flights:", flightsError);
    return { budget: 0, error: flightsError };
  }

  const { data: stays, error: staysError } = await supabase
    .from("stays")
    .select("price_per_night, check_in_date, check_out_date")
    .eq("trip_id", tripId);

  if (staysError) {
    console.error("Error fetching stays:", staysError);
    return { budget: 0, error: staysError };
  }

  const totalFlights = flights.reduce(
    (sum, flight) => sum + parseFloat(flight.price),
    0
  );
  const totalStays = stays.reduce(
    (sum, stay) => sum + getTotalPrice(stay),
    0
  );

  return { budget: totalFlights + totalStays, error: null };
};

export const getUserAnalytics = async (userId: string) => {
  const { data, error } = await supabase
    .from("trips")
    .select("id, name, start_date, end_date, countries")
    .eq("user_id", userId ? userId : "")
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Error fetching user analytics:", error);
    return { data: null, error };
  }

  const countriesVisited = data.map((trip: Trip) => trip.countries).flat();

  return {
    data: {
      totalTrips: data.length,
      countriesVisited: countriesVisited,
    },
    error: null,
  };
};
