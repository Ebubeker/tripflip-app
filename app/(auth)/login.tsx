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

const { width, height } = Dimensions.get("window");

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const topWaveHeight = Math.max(height * 0.25, 150);
  const bottomWaveHeight = Math.max(height * 0.15, 100);

  const contentPadding = height < 700 ? 20 : 40;

  async function loginWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) Alert.alert(error.message);
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
          zIndex: 1,
        }}
      >
        <View className="w-full max-w-[300px] items-center">
          <Text className="text-2xl mb-3 font-lato-bold text-center">
            Login
          </Text>
          <Text className="text-sm text-black/70 text-center mb-6 leading-5 font-lato">
            Login to your existing account and continue planning your trips🚀!
          </Text>

          <TextInput
            className="border px-4 py-3 rounded-md border-black/20 w-full mb-4 text-base font-lato"
            style={{
              height: 48,
              paddingVertical: Platform.OS === 'ios' ? 12 : 8,
              paddingTop: Platform.OS === 'ios' ? 8 : 12,
              lineHeight: Platform.OS === 'ios' ? 20 : undefined,
            }}
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="rgba(0,0,0,0.5)"
          />

          <TextInput
            className="h-12 border px-4 py-3 rounded-md border-black/20 w-full mb-6 text-base font-lato"
            style={{
              height: 48,
              paddingVertical: Platform.OS === 'ios' ? 12 : 8,
              paddingTop: Platform.OS === 'ios' ? 8 : 12,
              lineHeight: Platform.OS === 'ios' ? 20 : undefined,
            }}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="rgba(0,0,0,0.5)"
          />

          <TouchableOpacity
            className="bg-primary py-3 rounded-lg w-full"
            onPress={loginWithEmail}
          >
            <Text className="text-white font-semibold text-center text-base font-lato-bold">
              Login
            </Text>
          </TouchableOpacity>
          <Text className="text-sm mt-4 text-black/70 text-center mb-6 leading-5 font-lato">
            You do not have an account? Then{" "}
            <Link href="/register" asChild>
              <Text className="text-primary font-semibold underline">
                create one
              </Text>
            </Link>{" "}
            now!
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

export default Login;
