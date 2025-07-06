import { useGetFlightsByTripId } from "@/hooks/useTrip";
import { PlaneIcon, PlusIcon } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AddFlightModal from "./AddFlightModal";
import FlightItem from "./FlightItem";

interface FlightsProps {
  tripId?: string;
}

const Flights = ({ tripId }: FlightsProps) => {
  const [show, setShow] = useState(false);
  const { flights, loading, refetch } = useGetFlightsByTripId(tripId || "");

  console.log(flights);

  return (
    <View>
      <View className="flex-row items-center gap-3">
        <PlaneIcon />
        <Text className="text-xl font-lato-bold">Flights</Text>
      </View>
      {!loading && flights ? (
        <View style={{ marginTop: 12 }}>
          {flights.map((flightData, index: number) => (
            <FlightItem
              key={index}
              flight={flightData}
              onPress={() => console.log("hi")}
            />
          ))}
        </View>
      ) : (
        <View className="items-center justify-center" style={{ height: 60 }}>
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
