import { useGetPlacesByTripId } from "@/hooks/useTrip";
import { MapPin, PlusIcon } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AddPlaceModal from "./AddPlaceModal";
import PlaceItem from "./PlaceItem";

interface PlacesToVisitProps {
  tripId?: string;
}

const PlacesToVisit = ({ tripId }: PlacesToVisitProps) => {
  const [show, setShow] = useState(false);

  const { placesVisit, loading, refetch } = useGetPlacesByTripId(tripId || "");

  return (
    <View>
      <View className="flex-row items-center gap-3">
        <MapPin />
        <Text className="text-xl font-lato-bold">Places To Visit</Text>
      </View>
      {!loading && placesVisit && placesVisit.length > 0 ? (
        <View style={{ marginTop: 12 }}>
          {placesVisit.map((placeToVisit, index: number) => (
            <PlaceItem key={index} place={placeToVisit} />
          ))}
        </View>
      ) : (
        <View className="items-center justify-center" style={{ height: 60 }}>
          <Text style={{ color: "#00000080" }} className="font-lato">
            No places added yet.
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
          <Text className="text-sm text-gray-500 font-lato">
            Add a place to visit
          </Text>
        </View>
      </TouchableOpacity>
      <AddPlaceModal
        tripId={tripId}
        show={show}
        setShow={setShow}
        refetch={refetch}
      />
    </View>
  );
};

export default PlacesToVisit;
