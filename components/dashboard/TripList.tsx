import { useTrip } from "@/hooks/useTrip";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const TripList = ({ userId }: { userId: string }) => {
  const { trips, refetch } = useTrip(userId);

  const router = useRouter();

  function calculateTripDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
    );
    return `${duration} days`;
  }

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  return (
    <View className="gap-4 mt-8">
      {trips
        ? trips.map((trip, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                router.push(`/trip/${trip.id}`);
              }}
            >
              <View
                key={index}
                className="flex-row items-center px-5"
                style={{
                  gap: 16,
                }}
              >
                <Image
                  src="https://cdn.getyourguide.com/img/tour/45d89838b157ed97c70570b6bd0a67e039589f38f1139081ccb4477199e88317.jpg/98.jpg"
                  className="rounded-xl"
                  height={100}
                  width={100}
                />
                <View className="flex-1 gap-1">
                  <Text className="text-black font-lato-bold text-xl">
                    {trip.name}
                  </Text>
                  <Text
                    className="text-gray-500 font-lato-bold text-base"
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    {calculateTripDuration(trip.start_date, trip.end_date)}
                  </Text>
                  <Text className="text-black font-lato-bold text-xl">
                    $2.450
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        : null}
    </View>
  );
};

export default TripList;
