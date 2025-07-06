import AIAssistant from "@/components/dashboard/AIAssistant";
import TripDetails from "@/components/dashboard/TripDetails";
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const TripPage = () => {
  const { id } = useLocalSearchParams();
  const [tabs, setTabs] = useState("trip");

  if (!id) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="bg-white h-full">
      <View className="flex-row">
        <TouchableOpacity
          className={`w-1/2 p-4 items-center border-b border-x  ${
            tabs === "trip" ? "border-transparent" : "border-black/30 bg-[#0000000d]"
          }`}
          onPress={() => setTabs("trip")}
        >
          <Text className={`${tabs === "trip" ? "" : "text-black/40"} font-lato-bold`}>Trip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-1/2 p-4 items-center border-b border-x  ${
            tabs === "ai" ? "border-transparent" : "border-black/30 bg-[#0000000d]"
          }`}
          onPress={() => setTabs("ai")}
        >
          <Text className={`${tabs === "ai" ? "" : "text-black/40"} font-lato-bold`}>AI Assistent</Text>
        </TouchableOpacity>
      </View>
      {tabs === "trip" ? (
        <TripDetails tripId={id as string}/>
      ): null}
      {tabs === "ai" ? (
        <AIAssistant />
      ): null}
    </View>
  );
};

export default TripPage;
