import { useRecommendations } from "@/hooks/useRecommendations";
import {
  useGetFlightsByTripId,
  useGetPlacesByTripId,
  useGetStaysByTripId,
  useGetTripById,
} from "@/hooks/useTrip";
import { Trip } from "@/lib/api/trip";
import { useGetBudgetDetails } from "@/lib/utils/tripDetails";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import EditTripModel from "./EditTripModel";
import Flights from "./tripSections/Flights";
import PlacesToVisit from "./tripSections/PlacesToVisit";
import Stays from "./tripSections/Stays";
import TripBudgetSection from "./tripSections/TripBudgetSection";

const TripDetails = ({ tripId }: { tripId: string }) => {
  const [show, setShow] = useState(false);
  const { trip, updateTripById } = useGetTripById(tripId);
  const { placesVisit } = useGetPlacesByTripId(tripId || "");

  const router = useRouter();

  const {
    flights,
    loading: flightsLoading,
    refetch,
  } = useGetFlightsByTripId(tripId || "");

  const {
    stays,
    loading: staysLoading,
    refetch: staysRefetch,
  } = useGetStaysByTripId(tripId || "");

  const hasRecommendations = true;

  const getTravelFlightItemsCount = () => {
    let count = 0;
    if (flights) count += flights.length;
    return count;
  };

  const getTravelHotelItemsCount = () => {
    let count = 0;
    if (stays) count += stays.length;
    return count;
  };

  const { inboundFlight, returnFlight, recommendations, loading, failed, refetch: recommendationRefetch } =
    useRecommendations(
      {
        destination_city: trip ? trip.destination_city.toLowerCase() : "",
        destination_country: trip ? trip.countries[0].toLowerCase() : "",
        budget: 1500,
        passengers: {
          adults: trip?.passengers || 1,
          children: 0,
          infants: 0,
        },
        class: trip ? trip.selected_class : "economy",
        dates_start: trip ? trip.start_date : "",
        dates_end: trip ? trip.end_date : "",
        // current_city: "tirana",
        // current_country: "al",
        travel_style: "adventure",
        travel_interests: "museums,food",
      },
      Boolean(
        trip &&
          flights &&
          stays &&
          (getTravelFlightItemsCount() < 2 || getTravelHotelItemsCount() === 0)
      )
    );

  const sampleBudgetData = useGetBudgetDetails(
    flights ? flights : [],
    stays ? stays : [],
    1500,
    recommendations ? recommendations : undefined
  );

  const updateTrip = (
    updatedTrip: Omit<Trip, "id" | "created_at" | "updated_at">
  ) => {
    updateTripById(updatedTrip).then(() => {
      setShow(false);
    });
  };

  return (
    <ScrollView>
      <EditTripModel
        show={show}
        setShow={setShow}
        trip={trip}
        onTripUpdated={updateTrip}
      />
      <View style={{ marginBottom: 150 }}>
        <Image
          src={
            (trip && trip.selected_images) ||
            "https://cdn.getyourguide.com/img/tour/45d89838b157ed97c70570b6bd0a67e039589f38f1139081ccb4477199e88317.jpg/98.jpg"
          }
          className="rounded-xl w-full"
          height={150}
          width={100}
        />
        <TripBudgetSection
          budgetData={sampleBudgetData}
          hasRecommendations={hasRecommendations}
        />
        <View className="px-5">
          <View
            className="flex-row items-center"
            style={{
              width: "100%",
              justifyContent: "space-between",
              marginBottom: 8
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => router.replace("/")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#ffffff",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Ionicons name="arrow-back" size={24} color="#1f2937" />
              </TouchableOpacity>
              <Text numberOfLines={1} ellipsizeMode="tail" style={{width: '75%'}} className="text-2xl font-lato-bold py-4">
                {trip ? trip.name : null}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShow(true)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#ffffff",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Pencil size={16} />
            </TouchableOpacity>
          </View>
          <View className="" style={{ gap: 24 }}>
            <Flights
              tripId={tripId}
              flights={flights}
              loading={flightsLoading}
              refetch={refetch}
              recommendedInboundFlights={inboundFlight}
              recommendedInboundFlight={
                recommendations?.recommended_outbound_flight
              }
              recommendedReturnFlights={returnFlight}
              recommendedReturnFlight={
                recommendations?.recommended_return_flight
              }
              recommendationsLoading={loading}
              failed={failed}
              recommendationRefetch={recommendationRefetch}
            />
            <Stays
              tripId={tripId}
              stays={stays}
              loading={staysLoading}
              refetch={staysRefetch}
              recommendedStay={recommendations?.recommended_hotel}
              recommendedStays={recommendations?.stays}
              recommendationsLoading={loading}
              failed={failed}
              recommendationRefetch={recommendationRefetch}
            />
            <PlacesToVisit tripId={tripId} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default TripDetails;
