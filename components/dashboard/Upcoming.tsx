import { formatDateRange } from "@/lib/utils/dateFormatter";
import { Flight, Stay } from "@/type/recommendation";
import { useRouter } from "expo-router";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Minus,
  Star,
} from "lucide-react-native";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import RecommendationInfo from "./tripSections/recommendation/RecommendationInfo";

interface UpcomingProps {
  userId: string;
  trips: any;
  upcomingItem: any;
  refetchTrips: () => void;
}

export type PlaceType =
  | "attraction"
  | "restaurant"
  | "museum"
  | "park"
  | "beach"
  | "shopping"
  | "nightlife"
  | "activity"
  | "other";

export type OptionType = "must_see" | "would_like" | "if_time" | "backup";

export type StatusType = "planned" | "visited" | "skipped";

const FlightItemDetails = ({
  details,
  refetchTrips,
}: {
  details: any;
  refetchTrips: () => void;
}) => {
  const [selectedItem, setSelectedItem] = useState<Flight | Stay | null>(null);

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

  const findTotalPrice = (
    price: number,
    startDate: string,
    endDate: string
  ): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const total = price * daysDiff;
    return Math.round(total * 100) / 100;
  };

  const formattedDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const formatDateStay = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper function to format time
  const formatTime = (timeString: string | null) => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper function to get details type display name
  const getdetailsTypeDisplay = (type: detailsType) => {
    const typeMap = {
      attraction: "Attraction",
      restaurant: "Restaurant",
      museum: "Museum",
      park: "Park",
      beach: "Beach",
      shopping: "Shopping",
      nightlife: "Nightlife",
      activity: "Activity",
      other: "Other",
    };
    return typeMap[type];
  };

  // Helper function to get priority color
  const getPriorityColor = (priority: OptionType) => {
    const colorMap = {
      must_see: "#FF6B6B",
      would_like: "#4ECDC4",
      if_time: "#45B7D1",
      backup: "#96CEB4",
    };
    return colorMap[priority];
  };

  // Helper function to get status color and text
  const getStatusInfo = (status: StatusType) => {
    const statusMap = {
      planned: { color: "#45B7D1", text: "Planned" },
      visited: { color: "#4ECDC4", text: "Visited" },
      skipped: { color: "#95A5A6", text: "Skipped" },
    };
    return statusMap[status];
  };

  const statusInfo = getStatusInfo(details.status);
  const formattedDatePlace = formatDateStay(details.visit_date);
  const formattedTime = formatTime(details.visit_time);

  return (
    <View>
      <RecommendationInfo
        onAdd={() => console.log("Cannot add here")}
        refetch={refetchTrips}
        onSwap={() => console.log("Cannot swap here")}
        type={details.airline ? "flight" : "stay"}
        selectedRec={selectedItem}
        setSelectedRec={setSelectedItem}
        justInfo
      />
      {"airline" in details ? (
        <TouchableOpacity
          onPress={() => setSelectedItem(details)}
          className="!border-primary"
          style={{
            borderWidth: 2,
            borderStyle: "dashed",
            borderColor: "#FF8CBE",
            padding: 12,
            borderRadius: 12,
            marginTop: 12,
          }}
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
                {details.details_number || "details"}
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 8,
                paddingTop: 4,
                paddingBottom: 6,
                backgroundColor: getStatusColor(details.status),
                borderRadius: 14,
              }}
              className={`px-3 py-1`}
            >
              <Text
                className="font-lato text-xs capitalize"
                style={{ color: `white` }}
              >
                {details.status}
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
                {details.origin_airport}
              </Text>
              <Minus color={"#1c2230"} />
              <Text
                className="font-lato-bold text-2xl"
                style={{ color: "#1c2230" }}
              >
                {details.destination_airport}
              </Text>
            </View>
          </View>

          <View style={{ marginBottom: 2 }}>
            {details.airline && (
              <Text className="font-lato text-sm text-gray-700">
                {details.airline}
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
                {formatDate(details.departure_date)}
              </Text>
              {details.departure_time && (
                <Text className="font-lato text-sm text-gray-600">
                  {formatTime(details.departure_time)}
                </Text>
              )}
            </View>

            <View className="flex-1 items-end">
              <Text
                className="font-lato text-xs text-gray-500 mb-1"
                style={{ color: "#000000aa" }}
              >
                Arrival
              </Text>
              <Text className="font-lato-bold text-sm text-gray-900">
                {formatDate(details.arrival_date)}
              </Text>
              {details.arrival_time && (
                <Text className="font-lato text-sm text-gray-600">
                  {formatTime(details.arrival_time)}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ) : null}
      {"check_in_date" in details ? (
        <TouchableOpacity
          onPress={() => setSelectedItem(details)}
          className="!border-primary"
          style={{
            borderWidth: 2,
            borderStyle: "dashed",
            borderColor: "#FF8CBE",
            padding: 12,
            borderRadius: 12,
            marginTop: 12,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Image
            src={details.photo}
            className="rounded-xl"
            style={{ borderRadius: 12 }}
            width={110}
            height={110}
          />
          <View>
            <Text
              className="font-lato-bold text-xl"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ marginBottom: 2, width: 210 }}
            >
              {details.name}
            </Text>
            <Text
              className="font-lato-bold"
              style={{ color: "#00000080", marginBottom: 6 }}
            >
              {details.type[0].toUpperCase()}
              {details.type.slice(1)}
            </Text>
            <Text className="font-lato-bold" style={{ marginBottom: 6 }}>
              USD{" "}
              {findTotalPrice(
                details.price_per_night,
                details.check_in_date,
                details.check_out_date
              )}
            </Text>
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Text
                style={{ fontSize: 11, color: "#00000090" }}
                className="font-lato"
              >
                {formatDateRange(details.check_in_date, details.check_out_date)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : null}
      {"visit_date" in details ? (
        <TouchableOpacity
          onPress={() => setSelectedItem(details)}
          className="!border-primary"
          style={{
            borderWidth: 2,
            borderStyle: "dashed",
            borderColor: "#FF8CBE",
            padding: 12,
            borderRadius: 12,
            marginTop: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
            }}
          >
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#2C3E50",
                  marginBottom: 4,
                }}
              >
                {details.name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#7F8C8D",
                  textTransform: "capitalize",
                }}
              >
                {getdetailsTypeDisplay(details.type)}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: statusInfo.color,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                {statusInfo.text}
              </Text>
            </View>
          </View>

          {details.address && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <MapPin size={16} color="#7F8C8D" style={{ marginRight: 6 }} />
              <Text
                style={{
                  fontSize: 14,
                  color: "#7F8C8D",
                  flex: 1,
                }}
              >
                {details.address}
              </Text>
            </View>
          )}

          {(formattedDatePlace || formattedTime) && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Calendar size={16} color="#7F8C8D" style={{ marginRight: 6 }} />
              <Text
                style={{
                  fontSize: 14,
                  color: "#7F8C8D",
                }}
              >
                {formattedDatePlace && formattedTime
                  ? `${formattedDatePlace} at ${formattedTime}`
                  : formattedDatePlace || formattedTime}
              </Text>
            </View>
          )}

          {details.duration_hours && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Clock size={16} color="#7F8C8D" style={{ marginRight: 6 }} />
              <Text
                style={{
                  fontSize: 14,
                  color: "#7F8C8D",
                }}
              >
                {details.duration_hours} hour
                {details.duration_hours !== 1 ? "s" : ""}
              </Text>
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {details.estimated_cost && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 16,
                  }}
                >
                  <DollarSign
                    size={16}
                    color="#2C3E50"
                    style={{ marginRight: 2 }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#2C3E50",
                    }}
                  >
                    {details.currency} {details.estimated_cost}
                  </Text>
                </View>
              )}

              {details.rating && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Star
                    size={16}
                    color="#F39C12"
                    fill="#F39C12"
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#2C3E50",
                      fontWeight: "500",
                    }}
                  >
                    {details.rating}
                  </Text>
                </View>
              )}
            </View>

            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: getPriorityColor(details.priority),
              }}
            />
          </View>

          {details.tags && details.tags.length > 0 && (
            <View
              style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12 }}
            >
              {details.tags.slice(0, 3).map((tag, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: "#ECF0F1",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    marginRight: 6,
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#7F8C8D",
                    }}
                  >
                    {tag}
                  </Text>
                </View>
              ))}
              {details.tags.length > 3 && (
                <View
                  style={{
                    backgroundColor: "#ECF0F1",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#7F8C8D",
                    }}
                  >
                    +{details.tags.length - 3} more
                  </Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const Upcoming = ({
  userId,
  trips,
  upcomingItem,
  refetchTrips,
}: UpcomingProps) => {
  const router = useRouter();

  const formatDate = (start_date: Date) => {
    const newDate = new Date(start_date);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return newDate.toLocaleDateString("en-US", options);
  };

  return trips ? (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 24,
          marginBottom: 10,
          color: "#333",
        }}
      >
        Upcoming Trip
      </Text>
      <View
        className="rounded-2xl border-primary"
        style={{
          backgroundColor: "#FF8CBE40",
          borderWidth: 2,
          borderStyle: "dashed",
          padding: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push(`/trip/${trips.id}`)}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
          }}
        >
          <Text style={{ fontWeight: 600, fontSize: 16 }}>
            {trips ? trips.name : null}
          </Text>
          <Text style={{ fontWeight: 400, fontSize: 12 }}>
            {trips ? formatDate(trips.start_date) : null}
          </Text>
        </TouchableOpacity>
        {upcomingItem ? (
          <View>
            <FlightItemDetails
              details={upcomingItem}
              refetchTrips={refetchTrips}
            />
          </View>
        ) : null}
      </View>
    </View>
  ) : null;
};

export default Upcoming;
