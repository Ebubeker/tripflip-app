import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";

const { width } = Dimensions.get("window");

const AuthLayout = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowAuth, setShouldShowAuth] = useState(false);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session?.user) {
        router.replace("/(tabs)");
        return;
      }
      
      setShouldShowAuth(true);
    } catch (error) {
      console.error('Auth check error:', error);
      setShouldShowAuth(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      checkAuth();
    }, [])
  );

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        router.replace("/(tabs)");
      } else if (event === 'SIGNED_OUT') {
        setShouldShowAuth(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colorScheme === 'dark' ? '#000' : '#fff'
      }}>
        <ActivityIndicator 
          size="large" 
          color={Colors[colorScheme ?? "light"].tint} 
        />
      </View>
    );
  }

  if (!shouldShowAuth) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;