import TripList from "@/components/dashboard/TripList";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { PlusIcon } from 'lucide-react-native';
import { Alert, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        Alert.alert("Error", `Failed to logout: ${error.message}`);
        return;
      }

      Alert.alert("Success", "You have been logged out successfully!");
      console.log("User logged out successfully");
    } catch (err) {
      console.error("Unexpected logout error:", err);
      Alert.alert("Error", "An unexpected error occurred during logout");
    }
  };

  const { user, loading } = useUser();

  return (
    <View className="flex-1 bg-white px-5 pt-6">
      <Text className="text-black font-lato-bold text-3xl">
        Let's plan something amazing together, Ebubeker!
      </Text>
      <View className="gap-3">
        {user ? (
          <TripList userId={user?.id}/>
        ) : null}
        <View onTouchStart={()=>router.replace("/(tabs)/(trip)/new-trip")} className="items-center justify-center gap-3 py-5 border rounded-2xl border-dashed border-primary mt-4">
          <View className="bg-primary w-[50px] h-[50px] rounded-full justify-center items-center">
            <PlusIcon strokeWidth={3} color="white" className="w-[30px] stroke-[8px]" />
          </View>
          <Text className="font-lato">Create a new trip</Text>
        </View>
      </View>
    </View>
  );
}
