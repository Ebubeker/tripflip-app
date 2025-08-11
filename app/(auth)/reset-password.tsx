import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

const { width, height } = Dimensions.get("window");

const ResetPassword = () => {
  const router = useRouter();
  const { access_token, refresh_token } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sessionSet, setSessionSet] = useState(false);

  const topWaveHeight = Math.max(height * 0.25, 150);
  const bottomWaveHeight = Math.max(height * 0.15, 100);
  const contentPadding = height < 700 ? 20 : 40;

  useEffect(() => {
    // Set the session from the URL parameters
    if (access_token && refresh_token && !sessionSet) {
      supabase.auth.setSession({
        access_token: access_token as string,
        refresh_token: refresh_token as string,
      });
      setSessionSet(true);
    }
  }, [access_token, refresh_token, sessionSet]);

  async function updatePassword() {
    if (!password) {
      Alert.alert("Error", "Please enter a new password");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Success", 
        "Your password has been updated successfully!",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login")
          }
        ]
      );
    }
    setLoading(false);
  }

  return (
    <View className="flex-1 bg-white relative font-lato">
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
          zIndex: 10,
        }}
      >
        <View className="w-full max-w-[300px] items-center">
          <Text className="text-2xl mb-3 font-lato-bold text-center">
            Reset Password
          </Text>
          <Text className="text-sm text-black/70 text-center mb-6 leading-5 font-lato">
            Enter your new password below 🔐
          </Text>

          <TextInput
            className="border px-4 py-3 rounded-md border-black/20 w-full mb-4 text-base font-lato"
            style={{
              height: 48,
              paddingVertical: Platform.OS === "ios" ? 12 : 8,
              paddingTop: Platform.OS === "ios" ? 8 : 12,
              lineHeight: Platform.OS === "ios" ? 20 : undefined,
            }}
            placeholder="New Password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="rgba(0,0,0,0.5)"
          />

          <TextInput
            className="border px-4 py-3 rounded-md border-black/20 w-full mb-6 text-base font-lato"
            style={{
              height: 48,
              paddingVertical: Platform.OS === "ios" ? 12 : 8,
              paddingTop: Platform.OS === "ios" ? 8 : 12,
              lineHeight: Platform.OS === "ios" ? 20 : undefined,
            }}
            placeholder="Confirm New Password"
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="rgba(0,0,0,0.5)"
          />

          <TouchableOpacity
            className={`py-3 rounded-lg w-full mb-4 ${
              loading ? "bg-primary/50" : "bg-primary"
            }`}
            onPress={updatePassword}
            disabled={loading}
          >
            <Text className="text-white font-semibold text-center text-base font-lato-bold">
              {loading ? "Updating..." : "Update Password"}
            </Text>
          </TouchableOpacity>

          <Text className="text-sm mt-4 text-black/70 text-center mb-6 leading-5 font-lato">
            Remember your password?{" "}
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text className="text-primary font-semibold underline">
                Back to Login
              </Text>
            </TouchableOpacity>
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

export default ResetPassword;