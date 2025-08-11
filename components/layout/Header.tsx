import { useUser } from "@/hooks/useUser";
import { useRouter } from "expo-router";
import { Image, Platform, TouchableOpacity, View } from "react-native";

const Header = () => {
  const router = useRouter();

  const { user } = useUser();

  return (
    <View
      className="bg-white border-b mb-5 flex flex-row items-center justify-between"
      style={{
        height: 100,
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: Platform.OS === "ios" ? 44 : 20,
        boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
        borderColor: "rgba(0, 0, 0, 0.1) !important",
        // Account for status bar
      }}
    >
      <TouchableOpacity onPress={() => router.replace("/")}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={{
            width: 110,
            height: 37
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.replace("/profile")}
        className="w-[50px] h-[50px] bg-blue-500 items-center justify-center"
        style={{ width: 50, height: 50, borderRadius: 50 }}
      >
        <Image
          source={
            user && user.avatar_url
              ? { uri: user.avatar_url }
              : require("../../assets/images/traveler.png")
          }
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
