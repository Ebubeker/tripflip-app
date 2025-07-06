import React from "react";
import { Platform, Text, View } from "react-native";

const Header = () => {
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
      <Text className="font-lato-bold text-primary" style={{ fontSize: 20, fontWeight: "bold" }}>TravelApp</Text>
      <View
        className="w-[50px] h-[50px] bg-blue-500 items-center justify-center"
        style={{ width: 50, borderRadius: 50 }}
      >
        <Text
          className="text-[40px] text-white font-lato-bold"
          style={{ fontSize: 20, fontWeight: "bold" }}
        >
          U
        </Text>
      </View>
    </View>
  );
};

export default Header;
