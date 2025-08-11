import { countries } from "@/assets/statics";
import { useUser } from "@/hooks/useUser";
import { updateUser } from "@/lib/api/user";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const OnBoardingPage = () => {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [travelStyleInput, setTravelStyleInput] = useState("");
  const [travelStyles, setTravelStyles] = useState<string[]>([]);
  const [travelInterestsInput, setTravelInterestsInput] = useState("");
  const [travelInterests, setTravelInterests] = useState<string[]>([]);

  const { user } = useUser();

  const router = useRouter();

  const handleTravelStyleChange = (text: string) => {
    setTravelStyleInput(text);
    const styles = text
      .split(",")
      .map((style) => style.trim())
      .filter((style) => style.length > 0);
    setTravelStyles(styles);
  };

  const removeStyle = (indexToRemove: number) => {
    const newStyles = travelStyles.filter(
      (_, index) => index !== indexToRemove
    );
    setTravelStyles(newStyles);
    setTravelStyleInput(newStyles.join(", "));
  };

  const handleTravelInterestsChange = (text: string) => {
    setTravelInterestsInput(text);
    const interests = text
      .split(",")
      .map((interest) => interest.trim())
      .filter((interest) => interest.length > 0);
    setTravelInterests(interests);
  };

  const removeInterest = (indexToRemove: number) => {
    const newInterests = travelInterests.filter(
      (_, index) => index !== indexToRemove
    );
    setTravelInterests(newInterests);
    setTravelInterestsInput(newInterests.join(", "));
  };

  const handleSubmit = () => {
    console.log("City:", city);
    console.log("Country:", [country]);
    console.log("Travel Styles:", travelStyles);
    console.log("Travel Interests:", travelInterests);

    if (user) {
      updateUser(user.id, {
        city: city,
        country: [country],
        travel_interests: travelInterests,
        travel_style: travelStyles.join(', '),
      })
        .then(() => {
          router.replace('/')
        })
        .catch((error) => {
          console.error("Error updating user currency:", error);
        });
    }

    setCity("");
    setCountry("");
    setTravelStyleInput("");
    setTravelStyles([]);
    setTravelInterestsInput("");
    setTravelInterests([]);
  };

  return (
    <View
      className="flex-1 bg-white"
      style={{
        justifyContent: "center",
      }}
    >
      <View
        style={{
          paddingHorizontal: 50,
          paddingVertical: 20,
          gap: 10,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            fontFamily: "lato-bold",
            color: "#000",
            textAlign: "center",
          }}
        >
          Complete the setup
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "lato",
            color: "rgba(0,0,0,0.7)",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Before moving on please add your location and travel preferences
        </Text>

        <TextInput
          placeholderTextColor={"rgba(0,0,0,0.5)"}
          className="border px-4 py-3 rounded-md border-black/20 w-full text-base font-lato"
          style={{
            height: 48,
            paddingVertical: Platform.OS === "ios" ? 12 : 8,
            paddingTop: Platform.OS === "ios" ? 8 : 12,
            lineHeight: Platform.OS === "ios" ? 20 : undefined,
          }}
          placeholder="City (current)"
          value={city}
          onChangeText={(value) => setCity(value)}
        />
        <Dropdown
          style={{
            height: 50,
            backgroundColor: "white",
            borderRadius: 8,
            padding: 12,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
          }}
          placeholderStyle={{
            fontSize: 14,
            color: "rgba(49, 49, 49, 0.5)",
          }}
          selectedTextStyle={{
            fontSize: 14,
          }}
          inputSearchStyle={{
            height: 40,
            fontSize: 14,
          }}
          iconStyle={{
            width: 20,
            height: 20,
          }}
          data={countries}
          value={country}
          onChange={(item) => setCountry(item.value)}
          labelField="label"
          valueField="value"
          placeholder="Select Country"
          search
          searchPlaceholder="Search countries... "
        />

        <TextInput
          placeholderTextColor={"rgba(0,0,0,0.5)"}
          placeholder="Travel style (adventure, chill, extreme)"
          value={travelStyleInput}
          onChangeText={handleTravelStyleChange}
          className="border px-4 py-3 rounded-md border-black/20 w-full text-base font-lato"
          style={{
            height: 48,
            paddingVertical: Platform.OS === "ios" ? 12 : 8,
            paddingTop: Platform.OS === "ios" ? 8 : 12,
            lineHeight: Platform.OS === "ios" ? 20 : undefined,
          }}
          multiline={false}
        />

        {travelStyles.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 8 }}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              {travelStyles.map((style, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => removeStyle(index)}
                  style={{
                    backgroundColor: "#f0f0f0",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 14, marginRight: 4 }}>{style}</Text>
                  <Text style={{ fontSize: 16, color: "#666" }}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        <TextInput
          placeholderTextColor={"rgba(0,0,0,0.5)"}
          placeholder="Travel interests (museums, food, nightlife, culture)"
          value={travelInterestsInput}
          onChangeText={handleTravelInterestsChange}
          className="border px-4 py-3 rounded-md border-black/20 w-full text-base font-lato"
          style={{
            height: 48,
            paddingVertical: Platform.OS === "ios" ? 12 : 8,
            paddingTop: Platform.OS === "ios" ? 8 : 12,
            lineHeight: Platform.OS === "ios" ? 20 : undefined,
          }}
          multiline={false}
        />

        {travelInterests.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 8 }}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              {travelInterests.map((interest, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => removeInterest(index)}
                  style={{
                    backgroundColor: "#e3f2fd",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 14, marginRight: 4, color: "#1976d2" }}
                  >
                    {interest}
                  </Text>
                  <Text style={{ fontSize: 16, color: "#666" }}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-primary py-4 mt-4 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">
            Finish setup
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnBoardingPage;
