// import { Colors } from "@/constants/Colors";
// import { useColorScheme } from "@/hooks/useColorScheme";
// import { supabase } from "@/lib/supabase";
// import { useFocusEffect } from "@react-navigation/native";
// import { Stack, useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import { ActivityIndicator, Dimensions, View } from "react-native";

// const { width } = Dimensions.get("window");

// const AuthLayout = () => {
//   const router = useRouter();
//   const colorScheme = useColorScheme();
//   const [isLoading, setIsLoading] = useState(true);
//   const [shouldShowAuth, setShouldShowAuth] = useState(false);

//   const checkAuth = async () => {
//     try {
//       const { data: { session }, error } = await supabase.auth.getSession();
      
//       if (session?.user) {
//         router.replace("/(tabs)");
//         return;
//       }
      
//       setShouldShowAuth(true);
//     } catch (error) {
//       console.error('Auth check error:', error);
//       setShouldShowAuth(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   useFocusEffect(
//     React.useCallback(() => {
//       checkAuth();
//     }, [])
//   );

//   useEffect(() => {
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
//       if (session?.user) {
//         router.replace("/(tabs)");
//       } else if (event === 'SIGNED_OUT') {
//         setShouldShowAuth(true);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   if (isLoading) {
//     return (
//       <View style={{ 
//         flex: 1, 
//         justifyContent: 'center', 
//         alignItems: 'center',
//         backgroundColor: colorScheme === 'dark' ? '#000' : '#fff'
//       }}>
//         <ActivityIndicator 
//           size="large" 
//           color={Colors[colorScheme ?? "light"].tint} 
//         />
//       </View>
//     );
//   }

//   if (!shouldShowAuth) {
//     return null;
//   }

//   return (
//     <Stack>
//       <Stack.Screen name="register" options={{ headerShown: false }} />
//       <Stack.Screen name="login" options={{ headerShown: false }} />
//       <Stack.Screen name="subscription" options={{ headerShown: false }} />
//       <Stack.Screen name="forget-password" options={{ headerShown: false }} />
//     </Stack>
//   );
// };

// export default AuthLayout;

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Linking, View } from "react-native";

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

  const handleDeepLink = (url: string) => {
    if (url.includes('reset-password')) {
      // Extract tokens from URL
      const urlObj = new URL(url);
      const accessToken = urlObj.searchParams.get('access_token');
      const refreshToken = urlObj.searchParams.get('refresh_token');
      
      if (accessToken && refreshToken) {
        router.push(`/reset-password?access_token=${accessToken}&refresh_token=${refreshToken}`);
      }
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Handle deep links
    const setupDeepLinks = async () => {
      // Handle initial URL (when app is opened from a link)
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }

      // Handle subsequent URLs (when app is already open)
      const subscription = Linking.addEventListener('url', ({ url }) => {
        handleDeepLink(url);
      });

      return () => subscription?.remove();
    };

    setupDeepLinks();
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
      <Stack.Screen name="subscription" options={{ headerShown: false }} />
      <Stack.Screen name="forget-password" options={{ headerShown: false }} />
      <Stack.Screen name="reset-password" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;