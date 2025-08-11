import { supabase } from "@/lib/supabase";
import { formatDateRange } from "@/lib/utils/dateFormatter";
import { Flight, Stay } from "@/type/recommendation";
import { PlaneIcon, PlusIcon, XIcon } from "lucide-react-native";
import { useCallback, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { v4 } from "uuid";
import AddFlightModal from "./AddFlightModal";
import FlightItem from "./FlightItem";
import RecommendationInfo from "./recommendation/RecommendationInfo";

interface FlightsProps {
  tripId?: string;
  recommendedInboundFlights?: Flight[];
  recommendedInboundFlight?: Flight;
  recommendedReturnFlights?: Flight[];
  recommendedReturnFlight?: Flight;
  recommendationsLoading: boolean;
  flights: any;
  loading: boolean;
  refetch: () => void;
  failed: boolean;
  recommendationRefetch: () => void;
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
    is_direct: flightData.is_direct,
    is_return_flight: flightData.is_return_flight,
    segments_count: flightData.segments_count,
    total_duration: flightData.total_duration,
    total_duration_formatted: flightData.total_duration_formatted,
    transit_airports: flightData.transit_airports,
    transit_cities: flightData.transit_cities,
    transit_summary: flightData.transit_summary,
    created_at: flightData.created_at,
  };
}

const Flights = ({
  tripId,
  recommendedInboundFlights,
  recommendedInboundFlight,
  recommendedReturnFlights,
  recommendedReturnFlight,
  recommendationsLoading,
  flights,
  loading,
  refetch,
  failed,
  recommendationRefetch,
}: FlightsProps) => {
  const [selectedRecommendedFlight, setSelectedRecommendedFlight] =
    useState<Flight | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [show, setShow] = useState(false);
  const [hideRecommendations, setHideRecommendations] = useState(false);
  const [hideGoingRecommendations, setHideGoingRecommendations] =
    useState(false);

  const listOfFlightsToRecommend = recommendedInboundFlights
    ?.slice(0, 3)
    .filter(
      (flight) =>
        JSON.stringify(flight) !== JSON.stringify(recommendedInboundFlight)
    );

  const listOfReturnFlightsToRecommend = recommendedReturnFlights
    ?.slice(0, 3)
    .filter(
      (flight) =>
        JSON.stringify(flight) !== JSON.stringify(recommendedReturnFlight)
    );

  const isFlightData = (data: Flight | Stay | null): data is Flight => {
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
          }
        });
    }
  };

  const tripHasReturnFlight = useCallback(() => {
    if (hideRecommendations) return true;

    if (!flights || flights.length === 0) {
      return false;
    }

    return flights.some((flight: Flight) => flight.is_return_flight);
  }, [flights, hideRecommendations]);

  const showTripFailed = useCallback(() => {
    console.log("Failed:", failed);

    if (hideRecommendations) {
      return false;
    } else {

      if (
        flights &&
        flights.length >= 2 &&
        flights.some((flight: Flight) => !flight.is_return_flight) &&
        flights.some((flight: Flight) => flight.is_return_flight)
      ) {
        return false;
      } else {
        console.log("hiiiii");
        return failed;
      }
    }

    // return false;
  }, [failed, flights]);

  return (
    <View>
      <View className="flex-row items-center gap-3">
        <PlaneIcon />
        <Text className="text-xl font-lato-bold">Flights</Text>
      </View>
      {!loading && flights && flights.length ? (
        <View style={{ marginTop: 12 }}>
          {flights.map((flightData, index: number) => (
            <FlightItem
              key={index}
              flight={flightData}
              onPress={() => setSelectedFlight(flightData)}
            />
          ))}
        </View>
      ) : (
        <View className="items-center justify-center" style={{ minHeight: 60 }}>
          <Text style={{ color: "#00000080" }} className="font-lato">
            No flights added yet.
          </Text>
        </View>
      )}

      <TouchableOpacity onPress={() => setShow(true)}>
        <View
          className="items-center border border-dashed border-primary rounded-2xl py-3"
          style={{ gap: 4 }}
        >
          <View
            className="bg-primary rounded-full items-center justify-center"
            style={{ width: 30, height: 30 }}
          >
            <PlusIcon className="text-white" color="white" size={24} />
          </View>
          <Text className="text-sm text-gray-500 font-lato">Add flight</Text>
        </View>
      </TouchableOpacity>
      {!showTripFailed() ? (
        <></>
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 12,
            padding: 12,
            gap: 8,
            flexDirection: "column",
          }}
        >
          <Text className="text-red-500 font-lato">
            Failed to load recommendations.
          </Text>
          <TouchableOpacity onPress={() => recommendationRefetch()}>
            <View
              style={{
                backgroundColor: "#FF8CBE",
                padding: 10,
                borderRadius: 8,
                width: 150,
              }}
            >
              <Text
                style={{ textAlign: "center" }}
                className="font-lato-bold text-white"
              >
                Refetch Flights
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {!recommendationsLoading &&
      (!(flights && flights.length) ||
        (flights &&
          !flights.some((flight: Flight) => !flight.is_return_flight))) &&
      !hideGoingRecommendations ? (
        <View
          style={{
            marginTop: 12,
          }}
        >
          <Text
            className="font-lato-bold"
            style={{ fontSize: 10, fontWeight: "bold", marginBottom: 4 }}
          >
            Recommended
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text
              className="font-lato-bold"
              style={{ fontSize: 10, fontWeight: "bold", marginVertical: 4 }}
            >
              Outbound Flights
            </Text>
            <TouchableOpacity onPress={() => setHideGoingRecommendations(true)}>
              <XIcon size={12} style={{ cursor: "pointer" }} />
            </TouchableOpacity>
          </View>
          {recommendedInboundFlight ? (
            <TouchableOpacity
              onPress={() =>
                setSelectedRecommendedFlight(recommendedInboundFlight)
              }
              key={v4()}
              style={{
                backgroundColor: "#d268b6",
                borderColor: "#ffd500",
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
                <Text
                  className="font-lato-bold"
                  style={{
                    color: "#ffd500",
                  }}
                >
                  {recommendedInboundFlight.origin_airport} -{" "}
                  {recommendedInboundFlight.destination_airport}
                </Text>
                <Text
                  className="font-lato-bold"
                  style={{
                    color: "#ffd500",
                  }}
                >
                  {recommendedInboundFlight.price}{" "}
                  <Text style={{ fontSize: 10 }}>
                    {recommendedInboundFlight.currency}
                  </Text>
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
                  className="font-lato-light"
                  style={{
                    fontSize: 11,
                    color: "#ffd500",
                  }}
                >
                  {formatDateRange(
                    `${recommendedInboundFlight.departure_date}T${recommendedInboundFlight.departure_time}`,
                    `${recommendedInboundFlight.arrival_date}T${recommendedInboundFlight.arrival_time}`
                  )}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: "#ffd500",
                  }}
                >
                  {recommendedInboundFlight.airline}{" "}
                  <Text className="font-lato-bold">
                    ({recommendedInboundFlight.flight_number})
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}

          {recommendedInboundFlights
            ? listOfFlightsToRecommend?.slice(0, 2).map((flightRec) => (
                <TouchableOpacity
                  onPress={() => setSelectedRecommendedFlight(flightRec)}
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
                      {flightRec.origin_airport} -{" "}
                      {flightRec.destination_airport}
                    </Text>
                    <Text className="font-lato-bold text-white">
                      {flightRec.price}{" "}
                      <Text style={{ fontSize: 10 }}>{flightRec.currency}</Text>
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
                        `${flightRec.departure_date}T${flightRec.departure_time}`,
                        `${flightRec.arrival_date}T${flightRec.arrival_time}`
                      )}
                    </Text>
                    <Text
                      className="text-white"
                      style={{
                        fontSize: 11,
                      }}
                    >
                      {flightRec.airline}{" "}
                      <Text className="font-lato-bold">
                        ({flightRec.flight_number})
                      </Text>
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            : null}
        </View>
      ) : null}
      {!recommendationsLoading &&
      !tripHasReturnFlight() &&
      recommendedReturnFlight ? (
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text
              className="font-lato-bold"
              style={{ fontSize: 10, fontWeight: "bold", marginVertical: 4 }}
            >
              Return Flights
            </Text>
            <TouchableOpacity onPress={() => setHideRecommendations(true)}>
              <XIcon size={12} style={{ cursor: "pointer" }} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() =>
              setSelectedRecommendedFlight(recommendedReturnFlight)
            }
            key={v4()}
            style={{
              backgroundColor: "#d268b6",
              borderColor: "#ffd500",
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
              <Text
                className="font-lato-bold"
                style={{
                  color: "#ffd500",
                }}
              >
                {recommendedReturnFlight.origin_airport} -{" "}
                {recommendedReturnFlight.destination_airport}
              </Text>
              <Text
                className="font-lato-bold"
                style={{
                  color: "#ffd500",
                }}
              >
                {recommendedReturnFlight.price}{" "}
                <Text style={{ fontSize: 10 }}>
                  {recommendedReturnFlight.currency}
                </Text>
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
                className="font-lato-light"
                style={{
                  fontSize: 11,
                  color: "#ffd500",
                }}
              >
                {formatDateRange(
                  `${recommendedReturnFlight.departure_date}T${recommendedReturnFlight.departure_time}`,
                  `${recommendedReturnFlight.arrival_date}T${recommendedReturnFlight.arrival_time}`
                )}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: "#ffd500",
                }}
              >
                {recommendedReturnFlight.airline}{" "}
                <Text className="font-lato-bold">
                  ({recommendedReturnFlight.flight_number})
                </Text>
              </Text>
            </View>
          </TouchableOpacity>

          {recommendedReturnFlights
            ? listOfReturnFlightsToRecommend?.slice(0, 2).map((flightRec) => (
                <TouchableOpacity
                  onPress={() => setSelectedRecommendedFlight(flightRec)}
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
                      {flightRec.origin_airport} -{" "}
                      {flightRec.destination_airport}
                    </Text>
                    <Text className="font-lato-bold text-white">
                      {flightRec.price}{" "}
                      <Text style={{ fontSize: 10 }}>{flightRec.currency}</Text>
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
                        `${flightRec.departure_date}T${flightRec.departure_time}`,
                        `${flightRec.arrival_date}T${flightRec.arrival_time}`
                      )}
                    </Text>
                    <Text
                      className="text-white"
                      style={{
                        fontSize: 11,
                      }}
                    >
                      {flightRec.airline}{" "}
                      <Text className="font-lato-bold">
                        ({flightRec.flight_number})
                      </Text>
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            : null}
        </View>
      ) : null}
      {recommendationsLoading &&
      (flights || flights.length === 0 || (flights && flights.length < 2)) ? (
        <View
          style={{
            height: 150,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color="#d268b6" />
          <Text>Generating Recommendations</Text>
        </View>
      ) : null}

      <RecommendationInfo
        selectedRec={
          selectedRecommendedFlight ? selectedRecommendedFlight : selectedFlight
        }
        setSelectedRec={
          selectedRecommendedFlight
            ? setSelectedRecommendedFlight
            : setSelectedFlight
        }
        type="flight"
        onAdd={addFlightToTrip}
        justInfo={Boolean(selectedFlight)}
        refetch={refetch}
      />
      {tripId && (
        <AddFlightModal
          tripId={tripId}
          show={show}
          setShow={setShow}
          refetch={refetch}
        />
      )}
    </View>
  );
};

export default Flights;
