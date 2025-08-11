import { Minus } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface FlightData {
  airline: string | null;
  arrival_date: string;
  arrival_time: string | null;
  booking_reference: string | null;
  currency: string;
  departure_date: string;
  departure_time: string | null;
  destination_airport: string;
  destination_city: string | null;
  flight_number: string | null;
  id: string;
  is_return_flight: boolean;
  notes: string | null;
  origin_airport: string;
  origin_city: string | null;
  price: number;
  seat_number: string | null;
  status: string;
  trip_id: string;
}

interface FlightItemProps {
  flight: FlightData;
  onPress?: () => void;
}

const FlightItem: React.FC<FlightItemProps> = ({ flight, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string, opacity?: string) => {
    opacity = opacity ? opacity : "ff";
    switch (status.toLowerCase()) {
      case "booked":
        return `#278149${opacity}`;
      case "cancelled":
        return `#af2323${opacity}`;
      case "pending":
        return `#a66923${opacity}`;
      default:
        return `#1f2937${opacity}`;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-primary"
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center" style={{ marginRight: 4 }}>
          <View
            style={{ width: 22, height: 22, marginRight: 4 }}
            className="bg-primary rounded-full items-center justify-center"
          >
            <Text className="text-white font-lato-bold text-sm">✈</Text>
          </View>
          <Text className="font-lato-bold text-lg text-gray-900">
            {flight.flight_number || "Flight"}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 8,
            paddingTop: 4,
            paddingBottom: 6,
            backgroundColor: getStatusColor(flight.status),
            borderRadius: 14,
          }}
          className={`px-3 py-1`}
        >
          <Text
            className="font-lato text-xs capitalize"
            style={{ color: `white` }}
          >
            {flight.status}
          </Text>
        </View>
      </View>

      <View
        className="flex-row items-center justify-between"
        style={{ marginBottom: 2 }}
      >
        <View className="flex-1 flex-row items-center">
          <Text
            className="font-lato-bold text-2xl"
            style={{ color: "#1c2230" }}
          >
            {flight.origin_airport}
          </Text>
          <Minus color={"#1c2230"} />
          <Text
            className="font-lato-bold text-2xl"
            style={{ color: "#1c2230" }}
          >
            {flight.destination_airport}
          </Text>
        </View>
      </View>

      <View style={{ marginBottom: 2 }}>
        {flight.airline && (
          <Text className="font-lato text-sm text-gray-700">
            {flight.airline}
          </Text>
        )}
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-1">
          <Text
            className="font-lato text-xs mb-1"
            style={{ color: "#000000aa" }}
          >
            Departure
          </Text>
          <Text className="font-lato-bold text-sm text-gray-900">
            {formatDate(flight.departure_date)}
          </Text>
          {flight.departure_time && (
            <Text className="font-lato text-sm text-gray-600">
              {flight.departure_time}
            </Text>
          )}
        </View>

        {/* <View className="flex-1 items-center">
          {flight.airline && (
            <Text className="font-lato text-sm text-gray-700">
              {flight.airline}
            </Text>
          )}
          {flight.seat_number && (
            <Text className="font-lato text-xs text-gray-500">
              Seat {flight.seat_number}
            </Text>
          )}
        </View> */}

        <View className="flex-1 items-end">
          <Text
            className="font-lato text-xs text-gray-500 mb-1"
            style={{ color: "#000000aa" }}
          >
            Arrival
          </Text>
          <Text className="font-lato-bold text-sm text-gray-900">
            {formatDate(flight.arrival_date)}
          </Text>
          {flight.arrival_time && (
            <Text className="font-lato text-sm text-gray-600">
              {flight.arrival_time}
            </Text>
          )}
        </View>
      </View>

      <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
        <View>
          <Text className="font-lato-bold text-xl text-gray-900">
            {flight.currency} {flight.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FlightItem;
