import { useGetTripById } from "@/hooks/useTrip";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import Flights from "./tripSections/Flights";
import PlacesToVisit from "./tripSections/PlacesToVisit";
import Stays from "./tripSections/Stays";

const TripDetails = ({ tripId }: { tripId: string }) => {
  const { trip } = useGetTripById(tripId);

  return (
    <ScrollView>
      <View style={{ paddingBottom: 110 }}>
        <Image
          src="https://cdn.getyourguide.com/img/tour/45d89838b157ed97c70570b6bd0a67e039589f38f1139081ccb4477199e88317.jpg/98.jpg"
          className="rounded-xl w-full"
          height={150}
          width={100}
        />
        <View className="px-5">
          <Text className="text-3xl font-lato-bold py-4">
            {trip ? trip.name : null}
          </Text>
          <View className="" style={{ gap: 24 }}>
            <Flights tripId={tripId} />
            <Stays tripId={tripId} />
            <PlacesToVisit tripId={tripId} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default TripDetails;
