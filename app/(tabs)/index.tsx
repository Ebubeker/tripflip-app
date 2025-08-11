import TripList from "@/components/dashboard/TripList";
import Upcoming from "@/components/dashboard/Upcoming";
import { useTrip } from "@/hooks/useTrip";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "expo-router";
import { PlusIcon } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  const { user, loading } = useUser();
  const { trips, refetch, latestTrip, upCommingTripItem } = useTrip(
    user ? user?.id : ""
  );

  const refetchAllTrips = () => {
    refetch();
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-5 py-6">
        <TouchableOpacity onPress={() => router.replace("/on-boarding")}>
          <View>
            <Text>On boarding</Text>
          </View>
        </TouchableOpacity>
        <Text className="text-black font-lato-bold text-3xl">
          Let's plan something amazing together, {user?.first_name}!
        </Text>
        <View className="gap-3" style={{ marginBottom: 18 }}>
          {user ? (
            <>
              <Upcoming
                userId={user?.id}
                trips={latestTrip}
                upcomingItem={upCommingTripItem}
                refetchTrips={refetchAllTrips}
              />
              <TripList trips={trips} refetchTrips={refetchAllTrips} />
            </>
          ) : null}
          <View
            onTouchStart={() => router.replace("/(tabs)/(trip)/new-trip")}
            className="items-center justify-center gap-3 py-5 border rounded-2xl border-dashed border-primary mt-4"
          >
            <View className="bg-primary w-[50px] h-[50px] rounded-full justify-center items-center">
              <PlusIcon
                strokeWidth={3}
                color="white"
                className="w-[30px] stroke-[8px]"
              />
            </View>
            <Text className="font-lato">Create a new trip</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
