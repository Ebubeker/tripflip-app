import { useGetFlightsByTripId, useGetStaysByTripId, useGetTripById } from "@/hooks/useTrip";
import { fetchFlights, fetchStays } from "@/lib/api/get_recomendations";
import { removeTripItem } from "@/lib/api/trip";
import { supabase } from "@/lib/supabase";
import { formatDateRange } from "@/lib/utils/dateFormatter";
import { findTotalPrice } from "@/lib/utils/tripDetails";
import { Flight, Stay } from "@/type/recommendation";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { v4 } from "uuid";
import RecommendationInfo from "./RecommendationInfo";

interface getRecommendationsProps {
  type: "stay" | "flight";
  tripId: string;
  fetch: boolean;
  refetch: () => void;
  setShow: (show: boolean) => void;
}

function formatFlightForDatabase(flightData: Flight, tripId: string) {
  return {
    trip_id: tripId,
    flight_number: flightData.flight_number,
    airline: flightData.airline,
    departure_date: flightData.departure_date,
    departure_time: flightData.departure_time,
    arrival_date: flightData.arrival_date,
    arrival_time: flightData.arrival_time,
    origin_airport: flightData.origin_airport,
    origin_city: flightData.origin_city,
    destination_airport: flightData.destination_airport,
    destination_city: flightData.destination_city,
    price: flightData.price,
    currency: flightData.currency,
    booking_reference: flightData.booking_reference,
    seat_number: flightData.seat_number,
    notes: flightData.notes,
    // status: ,
    is_return_flight: flightData.is_return_flight,
    created_at: flightData.created_at,
  };
}

function formatStayForDatabase(stayData: Stay, tripId: string) {
  return {
    trip_id: tripId,
    name: stayData.name,
    type: stayData.type,
    address: stayData.address,
    city: stayData.city,
    country: stayData.country,
    check_in_date: stayData.check_in_date,
    check_in_time: stayData.check_in_time,
    check_out_date: stayData.check_out_date,
    check_out_time: stayData.check_out_time,
    nights_count: stayData.nights_count,
    price_per_night: stayData.price_per_night,
    total_price: stayData.total_price,
    currency: stayData.currency,
    booking_reference: stayData.booking_reference,
    room_type: stayData.room_type,
    guests_count: stayData.guests_count,
    phone: stayData.phone,
    email: stayData.email,
    website: stayData.website,
    rating: stayData.rating,
    notes: stayData.notes,
    amenities: stayData.amenities,
    // status: stayData.status,
    created_at: stayData.created_at,
    photo: stayData.photo,
    booking_link: stayData.booking_link,
  };
}

const GetRecommendations = ({
  type,
  tripId,
  fetch = false,
  refetch,
  setShow,
}: getRecommendationsProps) => {
  const [selectedRecommendedFlight, setSelectedRecommendedFlight] =
    useState<Flight | null>(null);
  const [recommendedFlights, setRecommendedFlights] = useState<
    Flight[] | undefined
  >(undefined);
  const [recommendedStays, setRecommendedStays] = useState<Stay[] | undefined>(
    undefined
  );
  const [dataLoading, setLoading] = useState(false);

  const { flights, refetch: refetchFlights } = useGetFlightsByTripId(
    tripId || ""
  );

  const { stays: staysData } = useGetStaysByTripId(tripId || "")

  const { trip, loading } = useGetTripById(tripId);

  useEffect(() => {
    if (fetch && trip && !loading) {
      const tripParams = {
        destination_city: trip.destination_city,
        destination_country: trip.countries[0].toLocaleLowerCase(),
        budget: 1500,
        dates_start: trip.start_date,
        dates_end: trip.end_date,
        current_city: "tirana",
        current_country: "al",
        travel_style: "",
        travel_interests: "",
        passengers: {
          adults: trip.passengers || 1,
          children: 0,
          infants: 0,
        },
        class: trip.selected_class || "economy",
      };

      setLoading(true);
      if (type === "stay") {
        fetchStays(tripParams).then((stays) => {
          if (stays.data.stays.length > 0) {
            setRecommendedStays(stays.data.stays);
          } else {
            setRecommendedStays(undefined);
          }
          setLoading(false);
        });
      } else if (type === "flight") {
        fetchFlights(tripParams).then((flights) => {
          if (flights.data.flights.length > 0) {
            setRecommendedFlights(flights.data.flights);
          } else {
            setRecommendedFlights(undefined);
          }
          setLoading(false);
        });
      }
    }
  }, [type, trip, fetch]);

  const isFlightData = (data: Flight | Stay | null): data is Flight => {
    return true;
  };

  const isStayData = (data: Flight | Stay | null): data is Stay => {
    return true;
  };

  const addFlightToTrip = (flight: Stay | Flight) => {
    if (isFlightData(flight) && tripId) {
      const flightData = formatFlightForDatabase(flight, tripId);
      supabase
        .from("flights")
        .insert({
          id: v4(),
          ...flightData,
        })
        .then(({ data, error }) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Flight added successfully:", data);
            refetch();
            setSelectedRecommendedFlight(null);
            setTimeout(() => {
              setShow(false);
            }, 500);
          }
        });
    }
  };

  const addStayToTrip = (stay: Stay | Flight) => {
    if (isStayData(stay) && tripId) {
      const stayData = formatStayForDatabase(stay, tripId);
      supabase
        .from("stays")
        .insert({
          id: v4(),
          ...stayData,
        })
        .then(({ data, error }) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Flight added successfully:", data);
            refetch();
            setSelectedRecommendedFlight(null);
            setTimeout(() => {
              setShow(false);
            }, 500);
          }
        });
    }
  };

  const swapFlight = (item: Flight | Stay) => {
    if (isFlightData(item) && tripId) {
      if (item.is_return_flight) {
        const returnFlight = flights.find(
          (flight: Flight) => flight.is_return_flight
        );
        removeTripItem(
          type === "flight" ? "flights" : "stays",
          returnFlight.id.toString()
        )
          .then(({ data, error }) => {
            if (error) {
              Alert.alert(
                "Error",
                "Failed to remove trip item. Please try again later."
              );
            } else {
              addFlightToTrip(item);
            }
          })
          .catch(() => {
            Alert.alert(
              "Error",
              "Failed to remove trip item. Please try again later."
            );
          });
      } else if (!item.is_return_flight) {
        const oneWayFlight = flights.find(
          (flight: Flight) => !flight.is_return_flight
        );
        removeTripItem(
          type === "flight" ? "flights" : "stays",
          oneWayFlight.id.toString()
        )
          .then(({ data, error }) => {
            if (error) {
              Alert.alert(
                "Error",
                "Failed to remove trip item. Please try again later."
              );
            } else {
              addFlightToTrip(item);
            }
          })
          .catch(() => {
            Alert.alert(
              "Error",
              "Failed to remove trip item. Please try again later."
            );
          });
      }
    }
  };

  const existsFlight = (flightToCheck: Flight) => {
    if (flightToCheck.is_return_flight) {
      return flights?.some((flight: Flight) => flight.is_return_flight);
    }

    if (flightToCheck.is_return_flight === false) {
      return flights?.some((flight: Flight) => !flight.is_return_flight);
    }
  };

  const flightIDsPresent = flights ? flights.map((flight: Flight) => (`${flight.booking_reference}_${flight.airline}_${flight.destination_airport}`)) : [];

  const recommendedFlightsFiltered = recommendedFlights ? recommendedFlights?.filter((recomFlight) =>
    !flightIDsPresent.includes(`${recomFlight.booking_reference}_${recomFlight.airline}_${recomFlight.destination_airport}`) 
  ) : [];

  const staysIDsPresent = staysData ? staysData.map((staysData: Stay) => (`${staysData.address}_${staysData.name}`)) : [];

  const recommendedStaysFiltered = recommendedStays ? recommendedStays?.filter((recomStays) =>
    !staysIDsPresent.includes(`${recomStays.address}_${recomStays.name}`) 
  ) : [];

  return (
    <View>
      <RecommendationInfo
        selectedRec={selectedRecommendedFlight}
        setSelectedRec={setSelectedRecommendedFlight}
        type={type}
        onAdd={type === "flight" ? addFlightToTrip : addStayToTrip}
        onSwap={swapFlight}
        swap={
          selectedRecommendedFlight
            ? existsFlight(selectedRecommendedFlight)
            : false
        }
        refetch={refetch}
      />
      {!dataLoading ? (
        <>
          {type === "flight" ? (
            recommendedFlightsFiltered ? (
              <ScrollView style={{ maxHeight: 350, marginVertical: 20 }}>
                {recommendedFlightsFiltered.map((flight, index) => (
                  <TouchableOpacity
                    onPress={() => setSelectedRecommendedFlight(flight)}
                    key={v4()}
                    style={{
                      backgroundColor: "#8c4479bb",
                      borderColor: "#8c4479",
                      borderWidth: 2,
                      borderStyle: "solid",
                      padding: 10,
                      borderRadius: 8,
                      marginTop: 2,
                      marginBottom: 2,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <Text className="text-white font-lato-bold">
                        {flight.origin_airport} - {flight.destination_airport}
                      </Text>
                      <Text className="font-lato-bold text-white">
                        {flight.price}{" "}
                        <Text style={{ fontSize: 10 }}>{flight.currency}</Text>
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        className="font-lato-light text-white"
                        style={{
                          fontSize: 11,
                        }}
                      >
                        {formatDateRange(
                          `${flight.departure_date}T${flight.departure_time}`,
                          `${flight.arrival_date}T${flight.arrival_time}`
                        )}
                      </Text>
                      <Text
                        className="text-white"
                        style={{
                          fontSize: 11,
                        }}
                      >
                        {flight.airline}{" "}
                        <Text className="font-lato-bold">
                          ({flight.flight_number})
                        </Text>
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View
                style={{
                  height: 150,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text>No Flights were found</Text>
              </View>
            )
          ) : null}
          {type === "stay" ? (
            recommendedStaysFiltered ? (
              <ScrollView style={{ maxHeight: 350, marginVertical: 20 }}>
                {recommendedStaysFiltered.map((stay, index) => (
                  <TouchableOpacity
                    onPress={() => setSelectedRecommendedFlight(stay)}
                    key={v4()}
                    style={{
                      padding: 10,
                    }}
                    className="mb-3 flex-row gap-3 items-center rounded-2xl border border-primary"
                  >
                    <Image
                      src={stay.photo}
                      className="rounded-xl"
                      style={{ borderRadius: 12 }}
                      width={80}
                      height={80}
                    />
                    <View>
                      <Text
                        className="font-lato-bold text-sm"
                        style={{ marginBottom: 2, width: 150 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {stay.name}
                      </Text>
                      <Text
                        className="font-lato-bold"
                        style={{ color: "#00000080", marginBottom: 6 }}
                      >
                        {stay.type[0].toUpperCase()}
                        {stay.type.slice(1)}
                      </Text>
                      <Text
                        className="font-lato-bold text-sm"
                        style={{ marginBottom: 6 }}
                      >
                        USD{" "}
                        {findTotalPrice(
                          stay.price_per_night,
                          stay.check_in_date,
                          stay.check_out_date
                        )}
                      </Text>
                      <View
                        className="flex-row items-center"
                        style={{ gap: 6 }}
                      >
                        <Text
                          style={{ fontSize: 11, color: "#00000090" }}
                          className="font-lato"
                        >
                          {formatDateRange(
                            stay.check_in_date,
                            stay.check_out_date
                          )}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View
                style={{
                  height: 150,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text>No Stays were found</Text>
              </View>
            )
          ) : null}
        </>
      ) : null}

      {dataLoading ? (
        <View
          style={{
            height: 150,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color="#d268b6" />
          <Text>Getting {type}s</Text>
        </View>
      ) : null}
    </View>
  );
};

export default GetRecommendations;
