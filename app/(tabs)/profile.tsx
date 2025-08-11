import ChangeImage from "@/components/profile/ChangeImage";
import ChangePasswordModal from "@/components/profile/ChangePaswordModal";
import CurrencyModal from "@/components/profile/CurrencyModal";
import EditProfileModal from "@/components/profile/EditProfileModal";
import LocationModal from "@/components/profile/LocationModal";
import TravelInterestsModal from "@/components/profile/TravelInterestsModal";
import TravelStyleModal from "@/components/profile/TravelStyleModal";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface User {
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
  tripsCompleted: number;
  countriesVisited: number;
}

interface TabContentProps {
  activeTab: string;
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("preferences");
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(true);
  const [locationEnabled, setLocationEnabled] = useState<boolean>(true);
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>("USD");
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [showChangeImage, setShowChangeImage] = useState<boolean>(false);
  const [showLocation, setShowLocation] = useState<boolean>(false);
  const [showTravelStyle, setShowTravelStyle] = useState<boolean>(false);
  const [showCurrency, setShowCurrency] = useState<boolean>(false);
  const [showTravelInterests, setShowTravelInterests] =
    useState<boolean>(false);
  const [showChangePass, setShowChangePass] = useState<boolean>(false);

  const { user, userAnalyticsData, loading, refetch } = useUser();

  const router = useRouter();

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }
    // If logout successful
    router.replace("/login");
  };

  const tabs = [
    // { id: "settings", label: "Settings", icon: "settings-outline" },
    { id: "security", label: "Security", icon: "shield-outline" },
    { id: "preferences", label: "Preferences", icon: "options-outline" },
  ];

  if (!user && loading) {
    return null;
  }

  const getMemberSince = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const SecurityContent: React.FC = () => (
    <View style={{ paddingHorizontal: 20 }}>
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: 16,
          }}
        >
          Security & Authentication
        </Text>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 16,
            paddingHorizontal: 16,
            backgroundColor: "#ffffff",
            borderRadius: 12,
            marginBottom: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
          onPress={() => setShowChangePass(true)}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: "#06b6d4",
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="key-outline" size={20} color="#ffffff" />
            </View>
            <View>
              <Text
                style={{ fontSize: 16, fontWeight: "500", color: "#1f2937" }}
              >
                Change Password
              </Text>
              <Text style={{ fontSize: 14, color: "#6b7280" }}>
                Update your account password
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const PreferencesContent: React.FC = () => (
    <View style={{ paddingHorizontal: 20 }}>
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: 16,
          }}
        >
          App Preferences
        </Text>

        <TouchableOpacity
          onPress={() => setShowLocation(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 16,
            paddingHorizontal: 16,
            backgroundColor: "#ffffff",
            borderRadius: 12,
            marginBottom: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: "#1f2937",
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="location-outline" size={20} color="#ffffff" />
            </View>
            <View>
              <Text
                style={{ fontSize: 16, fontWeight: "500", color: "#1f2937" }}
              >
                Location
              </Text>
              <Text style={{ fontSize: 14, color: "#6b7280" }}>
                Change your current location
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowTravelStyle(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 16,
            paddingHorizontal: 16,
            backgroundColor: "#ffffff",
            borderRadius: 12,
            marginBottom: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: "#b47926",
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="location-outline" size={20} color="#ffffff" />
            </View>
            <View>
              <Text
                style={{ fontSize: 16, fontWeight: "500", color: "#1f2937" }}
              >
                Travel Style
              </Text>
              <Text style={{ fontSize: 14, color: "#80776b" }}>
                Configure your travel style
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 16,
            paddingHorizontal: 16,
            backgroundColor: "#ffffff",
            borderRadius: 12,
            marginBottom: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
          onPress={() => setShowCurrency(true)}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: "#059669",
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="card-outline" size={20} color="#ffffff" />
            </View>
            <View>
              <Text
                style={{ fontSize: 16, fontWeight: "500", color: "#1f2937" }}
              >
                Currency
              </Text>
              <Text style={{ fontSize: 14, color: "#6b7280" }}>
                Configure your preferred currency
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowTravelInterests(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 16,
            paddingHorizontal: 16,
            backgroundColor: "#ffffff",
            borderRadius: 12,
            marginBottom: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: "#7c3aed",
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="airplane-outline" size={20} color="#ffffff" />
            </View>
            <View>
              <Text
                style={{ fontSize: 16, fontWeight: "500", color: "#1f2937" }}
              >
                Travel Interests
              </Text>
              <Text style={{ fontSize: 14, color: "#6b7280" }}>
                Set your travel interests
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabContent = (): JSX.Element => {
    switch (activeTab) {
      case "security":
        return <SecurityContent />;
      case "preferences":
        return <PreferencesContent />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {user ? (
        <>
          <EditProfileModal
            user={user}
            visible={showEditProfile}
            onClose={setShowEditProfile}
            refetch={refetch}
            onSave={() => console.log("save changes")}
          />
          <ChangeImage
            show={showChangeImage}
            setShow={setShowChangeImage}
            refetch={refetch}
            user={user}
          />
          <LocationModal
            show={showLocation}
            setShow={setShowLocation}
            user={user}
          />
          <TravelInterestsModal
            show={showTravelInterests}
            setShow={setShowTravelInterests}
            user={user}
          />
          <TravelStyleModal
            show={showTravelStyle}
            setShow={setShowTravelStyle}
            user={user}
          />
          <CurrencyModal
            show={showCurrency}
            setShow={setShowCurrency}
            user={user}
          />
          <ChangePasswordModal
            show={showChangePass}
            setShow={setShowChangePass}
          />
        </>
      ) : null}
      <StatusBar barStyle="dark-content" backgroundColor={"white"} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          style={{
            paddingTop: 20,
            paddingBottom: 20,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => router.replace("/")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#ffffff",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#1f2937" />
            </TouchableOpacity>

            <Text style={{ fontSize: 20, fontWeight: "700", color: "#1f2937" }}>
              Profile
            </Text>

            <TouchableOpacity
              onPress={() => setShowEditProfile(true)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#ffffff",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Ionicons name="create-outline" size={24} color="#1f2937" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info */}
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 24,
            backgroundColor: "#ffffff",
            borderRadius: 20,
            padding: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <View style={{ position: "relative" }}>
              <Image
                source={
                  user && user.avatar_url
                    ? { uri: user.avatar_url }
                    : require("../../assets/images/traveler.png")
                }
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  marginBottom: 16,
                }}
              />
              <TouchableOpacity
                onPress={() => setShowChangeImage(true)}
                style={{
                  position: "absolute",
                  bottom: 16,
                  right: 0,
                  width: 32,
                  height: 32,
                  backgroundColor: "#FF8CBE",
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 3,
                  borderColor: "#ffffff",
                }}
              >
                <Ionicons name="camera" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: 4,
              }}
            >
              {user?.first_name} {user?.last_name}
            </Text>
            <Text style={{ fontSize: 16, color: "#6b7280", marginBottom: 8 }}>
              {user?.email}
            </Text>
            <Text style={{ fontSize: 14, color: "#9ca3af" }}>
              Member since{" "}
              {user?.created_at ? getMemberSince(user.created_at) : null}
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{ fontSize: 24, fontWeight: "700", color: "#FF8CBE" }}
              >
                {userAnalyticsData?.totalTrips || 0}
              </Text>
              <Text style={{ fontSize: 14, color: "#6b7280" }}>
                Trips Completed
              </Text>
            </View>
            <View
              style={{
                width: 1,
                height: 40,
                backgroundColor: "#e5e7eb",
              }}
            />
            <View style={{ alignItems: "center" }}>
              <Text
                style={{ fontSize: 24, fontWeight: "700", color: "#6366f1" }}
              >
                {userAnalyticsData?.countriesVisited
                  ? userAnalyticsData?.countriesVisited.length
                  : 0}
              </Text>
              <Text style={{ fontSize: 14, color: "#6b7280" }}>
                Countries Visited
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 20,
            marginBottom: 24,
            backgroundColor: "#ffffff",
            borderRadius: 16,
            padding: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 8,
                borderRadius: 12,
                backgroundColor:
                  activeTab === tab.id ? "#FF8CBE" : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons
                name={tab.icon as any}
                size={20}
                color={activeTab === tab.id ? "#ffffff" : "#6b7280"}
                style={{ marginBottom: 4 }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: activeTab === tab.id ? "600" : "500",
                  color: activeTab === tab.id ? "#ffffff" : "#6b7280",
                  textAlign: "center",
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={{ marginBottom: 40 }}>{renderTabContent()}</View>

        {/* Logout Button */}
        <View style={{ paddingHorizontal: 20, marginBottom: 40 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#ef4444",
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
            onPress={() => logout()}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#ffffff"
              style={{ marginRight: 8 }}
            />
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
