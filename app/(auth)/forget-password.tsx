import { supabase } from "@/lib/supabase";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
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

const ForgotPassword = () => {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const topWaveHeight = Math.max(height * 0.25, 150);
  const bottomWaveHeight = Math.max(height * 0.15, 100);

  const contentPadding = height < 700 ? 20 : 40;

  async function resetPassword() {
    if (!email) {
      Alert.alert("Please enter your email address");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'tripflip://reset-password',
    });
    
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setSent(true);
      Alert.alert(
        "Reset Link Sent", 
        "Check your email for a password reset link"
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
            Forgot Password
          </Text>
          <Text className="text-sm text-black/70 text-center mb-6 leading-5 font-lato">
            {sent 
              ? "We've sent you a password reset link! Check your email 📧"
              : "Enter your email address and we'll send you a link to reset your password 🔐"
            }
          </Text>

          {!sent && (
            <>
              <TextInput
                className="border px-4 py-3 rounded-md border-black/20 w-full mb-6 text-base font-lato"
                style={{
                  height: 48,
                  paddingVertical: Platform.OS === "ios" ? 12 : 8,
                  paddingTop: Platform.OS === "ios" ? 8 : 12,
                  lineHeight: Platform.OS === "ios" ? 20 : undefined,
                }}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="rgba(0,0,0,0.5)"
              />

              <TouchableOpacity
                className={`py-3 rounded-lg w-full mb-4 ${
                  loading ? "bg-primary/50" : "bg-primary"
                }`}
                onPress={resetPassword}
                disabled={loading}
              >
                <Text className="text-white font-semibold text-center text-base font-lato-bold">
                  {loading ? "Sending..." : "Send Reset Link"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <Text className="text-sm mt-4 text-black/70 text-center mb-6 leading-5 font-lato">
            Remember your password?{" "}
            <Link href="/login" asChild>
              <Text className="text-primary font-semibold underline">
                Back to Login
              </Text>
            </Link>
          </Text>

          {sent && (
            <TouchableOpacity
              className="bg-primary py-3 rounded-lg w-full"
              onPress={() => {
                setSent(false);
                setEmail("");
              }}
            >
              <Text className="text-white font-semibold text-center text-base font-lato-bold">
                Send Another Link
              </Text>
            </TouchableOpacity>
          )}
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

export default ForgotPassword;