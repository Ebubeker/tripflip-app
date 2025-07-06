import { supabase } from "@/lib/supabase";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import uuid from "react-native-uuid";

const { width, height } = Dimensions.get("window");

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const topWaveHeight = Math.max(height * 0.25, 150);
  const bottomWaveHeight = Math.max(height * 0.15, 100);

  const contentPadding = height < 700 ? 20 : 40;

  async function signupWithEmail() {
    setLoading(true);
    const { error, data: authData } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            auth_id: authData.user?.id,
            email: email,
            username: `${firstName.toLowerCase()}${lastName.toLowerCase()}${uuid.v4()}`,
            first_name: firstName,
            last_name: lastName,
            display_name: `${firstName} ${lastName}`,
            avatar_url: null,
            bio: null,
            phone: null,
            date_of_birth: null,
            gender: null,
            country: null,
            city: null,
            travel_style: "mid_range",
            preferred_accommodation: "any",
            budget_range_min: null,
            budget_range_max: null,
            preferred_currency: "USD",
            languages_spoken: [],
            travel_interests: [],
            notification_preferences: {
              email_notifications: false,
              push_notifications: false,
              trip_reminders: false,
              friend_requests: false,
              travel_recommendations: false,
            },
          },
        ])
        .select();

      if (error) {
        console.error("Error creating user record:", error);
        Alert.alert("Error", `Failed to create user record: ${error.message}`);
        setLoading(false);

        return;
      }

      console.log("User record created successfully:", data);
      Alert.alert("Success", "User profile created successfully!");
      setLoading(false);

      return data[0];
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert(
        "Error",
        "An unexpected error occurred while creating user record"
      );
    }

    setLoading(false);
  }

  return (
    <View className="flex-1 bg-white relative">
      <Svg
        height={topWaveHeight}
        width={width}
        className="absolute top-0 fill-primary"
        viewBox={`0 0 ${width} ${topWaveHeight}`}
        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
      >
        <Path
          d={`M0,0 L${width},0 L${width},${topWaveHeight * 0.6} Q${
            width * 0.75
          },${topWaveHeight * 0.8} ${width * 0.5},${topWaveHeight * 0.7} Q${
            width * 0.25
          },${topWaveHeight * 0.6} 0,${topWaveHeight * 0.8} Z`}
          fill="#FF8CBE"
        />
      </Svg>
      <View
        className="flex-1 items-center justify-center px-5"
        style={{
          paddingTop: contentPadding,
          paddingBottom: contentPadding,
          zIndex: 1,
        }}
      >
        <View className="w-full max-w-[300px] items-center">
          <Text className="text-2xl font-bold mb-3 text-center font-lato-bold">
            Register
          </Text>
          <Text className="text-sm text-black/70 text-center mb-6 leading-5 font-lato">
            Create an account and start planning your trips in an easy and
            managable way🚀!
          </Text>
          <View className="w-full max-w-[300px] flex-row items-center">
            <TextInput
              className="border px-4 py-3 rounded-md border-black/20 w-[144px] mr-[12px] mb-4 text-base font-lato"
              placeholder="First Name"
              style={{
                height: 48,
                paddingVertical: Platform.OS === "ios" ? 12 : 8,
                paddingTop: Platform.OS === "ios" ? 8 : 12,
                lineHeight: Platform.OS === "ios" ? 20 : undefined,
              }}
              onChangeText={setFirstName}
              value={firstName}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="rgba(0,0,0,0.5)"
            />
            <TextInput
              className="border px-4 py-3 rounded-md border-black/20 w-[144px] mb-4 text-base font-lato"
              placeholder="Last Name"
              style={{
                height: 48,
                paddingVertical: Platform.OS === "ios" ? 12 : 8,
                paddingTop: Platform.OS === "ios" ? 8 : 12,
                lineHeight: Platform.OS === "ios" ? 20 : undefined,
              }}
              onChangeText={setLastName}
              value={lastName}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="rgba(0,0,0,0.5)"
            />
          </View>
          <TextInput
            className="border px-4 py-3 rounded-md border-black/20 w-full mb-4 text-base font-lato"
            placeholder="Email"
            style={{
              height: 48,
              paddingVertical: Platform.OS === "ios" ? 12 : 8,
              paddingTop: Platform.OS === "ios" ? 8 : 12,
              lineHeight: Platform.OS === "ios" ? 20 : undefined,
            }}
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="rgba(0,0,0,0.5)"
          />

          <TextInput
            className="border px-4 py-3 rounded-md border-black/20 w-full mb-6 text-base font-lato"
            onChangeText={setPassword}
            style={{
              height: 48,
              paddingVertical: Platform.OS === "ios" ? 12 : 8,
              paddingTop: Platform.OS === "ios" ? 8 : 12,
              lineHeight: Platform.OS === "ios" ? 20 : undefined,
            }}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="rgba(0,0,0,0.5)"
          />

          <TouchableOpacity
            className="bg-primary py-3 rounded-lg w-full"
            onPress={signupWithEmail}
          >
            <Text className="text-white font-semibold text-center text-base font-lato-bold">
              Sign up
            </Text>
          </TouchableOpacity>
          <Text className="text-sm mt-4 text-black/70 text-center mb-6 leading-5 font-lato">
            Do you have an account? Then{" "}
            <Link href="/login" asChild>
              <Text className="text-primary font-semibold underline">
                login
              </Text>
            </Link>{" "}
            here!
          </Text>
        </View>
      </View>
      <Svg
        height={bottomWaveHeight}
        width={width}
        className="absolute bottom-0 fill-primary"
        viewBox={`0 0 ${width} ${bottomWaveHeight}`}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
      >
        <Path
          d={`M0,${bottomWaveHeight} L${width},${bottomWaveHeight} L${width},${
            bottomWaveHeight * 0.3
          } Q${width * 0.5},0 0,${bottomWaveHeight * 0.3} Z`}
          fill="#FF8CBE"
        />
      </Svg>
    </View>
  );
};

export default Register;
