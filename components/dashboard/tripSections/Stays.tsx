import { useGetStaysByTripId } from "@/hooks/useTrip";
import { Hotel, PlusIcon } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AddStayModal from "./AddStayModal";
import StayItem from "./StayItem";

interface StaysProps {
  tripId?: string;
}

const Stays = ({ tripId }: StaysProps) => {
  const [show, setShow] = useState(false);

  const { stays, loading, refetch } = useGetStaysByTripId(tripId || "");

  return (
    <View>
      <View className="flex-row items-center gap-3">
        <Hotel />
        <Text className="text-xl font-lato-bold">Stays</Text>
      </View>
      {!loading && stays ? (
        <View style={{ marginTop: 12 }}>
          {stays.map((staysData, index: number) => (
            <StayItem key={index} stay={staysData} />
          ))}
        </View>
      ) : (
        <View className="items-center justify-center" style={{ height: 60 }}>
          <Text style={{ color: "#00000080" }} className="font-lato">
            No stays added yet.
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
          <Text className="text-sm text-gray-500 font-lato">Add stay</Text>
        </View>
      </TouchableOpacity>
      <AddStayModal
        tripId={tripId}
        show={show}
        setShow={setShow}
        refetch={refetch}
      />
    </View>
  );
};

export default Stays;
