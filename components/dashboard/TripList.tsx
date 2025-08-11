import { getTripBudget, removeTrip } from "@/lib/api/trip";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface TripItemProps {
  trip: any;
  onPress: () => void;
  onDelete: (tripId: string) => void;
}

const TripItem = ({ trip, onPress, onDelete }: TripItemProps) => {
  const [tripExpense, setTripExpense] = useState<number | undefined>(undefined);
  const translateX = useSharedValue(0);

  const calculateTripDuration = (
    startDate: string,
    endDate: string
  ): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
    );
    return `${duration} ${duration === 1 ? "day" : "days"}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${getOrdinalSuffix(day)} of ${month}`;
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    const endYear = new Date(endDate).getFullYear();

    return `${start} - ${end} ${endYear}`;
  };

  const handleDelete = () => {
    translateX.value = withTiming(-400, { duration: 300 }, () => {
      runOnJS(onDelete)(trip.id);
    });
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = Math.min(0, event.translationX);
    })
    .onEnd((event) => {
      if (event.translationX < -100) {
        translateX.value = withSpring(-80);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  useEffect(() => {
    getTripBudget(trip.id).then(({ budget, error }) => {
      if (error) {
        console.error("Error fetching trip budget:", error);
      } else {
        setTripExpense(budget);
      }
    });
  }, []);

  return (
    <View
      style={{
        position: "relative",
      }}
    >
      <View
        className="absolute justify-center items-center bg-[#000000]"
        style={{ width: 80, top: 0, right: 0, height: "100%" }}
      >
        <TouchableOpacity
          onPress={handleDelete}
          className="flex-1 justify-center items-center w-full"
        >
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            animatedStyle,
            {
              backgroundColor: "white",
            },
          ]}
        >
          <TouchableOpacity onPress={onPress}>
            <View
              className="flex-row items-center px-5"
              style={{
                gap: 16,
                paddingVertical: 4,
              }}
            >
              <Image
                src={
                  trip.selected_images
                    ? trip.selected_images
                    : "https://cdn.getyourguide.com/img/tour/45d89838b157ed97c70570b6bd0a67e039589f38f1139081ccb4477199e88317.jpg/98.jpg"
                }
                className="rounded-2xl"
                height={100}
                width={100}
              />
              <View className="flex-1 gap-1">
                <Text className="text-black font-lato-bold text-xl">
                  {trip.name}
                </Text>
                <Text
                  className="text-gray-500 font-lato-bold text-sm"
                  style={{
                    color: "#000000",
                  }}
                >
                  <Text style={{ fontSize: 12, color: "#6b7280" }}>
                    {formatDateRange(trip.start_date, trip.end_date)}
                  </Text>{" "}
                  ({calculateTripDuration(trip.start_date, trip.end_date)})
                </Text>
                <Text className="text-black font-lato-bold text-xl">
                  ${tripExpense?.toFixed(2) || "0.00"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const TripList = ({
  trips,
  refetchTrips,
}: {
  trips: any;
  refetchTrips: () => void;
}) => {
  const router = useRouter();

  const handleDeleteTrip = async (tripId: string) => {
    removeTrip(tripId)
      .then(({ data, error }) => {
        if (!error) {
          refetchTrips();
          Alert.alert(
            "Trip Deleted",
            "Your trip has been successfully deleted."
          );
        } else {
          Alert.alert(
            "Error",
            "There was an error deleting your trip. Please try again later."
          );
          console.error("Error deleting trip:", error);
        }
      })
      .catch((error) => {
        Alert.alert(
          "Error",
          "There was an error deleting your trip. Please try again later."
        );
        console.error("Error deleting trip:", error);
      });
  };

  useFocusEffect(
    useCallback(() => {
      refetchTrips();
    }, [])
  );

  return (
    <>
      <View>
        <Text className="text-black font-lato-bold text-2xl mt-4">
          My Trips
        </Text>
        <Text className="font-lato-light text-sm" style={{opacity: 0.5}}>
          Tap on a trip to view details or swipe left to delete.
        </Text>
      </View>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="gap-4 mt-8">
          {trips
            ? trips.map((trip, index: number) => (
                <TripItem
                  key={trip.id || index}
                  trip={trip}
                  onPress={() => {
                    router.push(`/trip/${trip.id}`);
                  }}
                  onDelete={handleDeleteTrip}
                />
              ))
            : null}
        </View>
      </GestureHandlerRootView>
    </>
  );
};

export default TripList;