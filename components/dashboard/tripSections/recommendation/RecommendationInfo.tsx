import CustomModal from "@/components/ui/Modal";
import { removeTripItem } from "@/lib/api/trip";
import type { Flight, Stay } from "@/type/recommendation";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface RecommendationInfo {
  selectedRec: (Flight | null) | (Stay | null);
  setSelectedRec: (rec: (Flight | null) | (Stay | null)) => void;
  type: "flight" | "stay";
  onAdd: (flight: Flight | Stay) => void;
  onSwap: (item: Flight | Stay) => void;
  justInfo?: boolean;
  swap?: boolean;
  refetch: () => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (timeString: string) => {
  return timeString.slice(0, 5);
};

const RecommendationInfo = ({
  selectedRec,
  setSelectedRec,
  type,
  onAdd,
  onSwap,
  justInfo = false,
  swap = false,
  refetch,
}: RecommendationInfo) => {
  const isFlightData = (data: Flight | Stay | null): data is Flight => {
    return type === "flight";
  };

  const isStayData = (data: Flight | Stay | null): data is Stay => {
    return type === "stay";
  };

  const handleBooking = async () => {
    try {
      if (isStayData(selectedRec) && selectedRec.booking_link) {
        await Linking.openURL(selectedRec.booking_link);
      } else if (isFlightData(selectedRec) && selectedRec.notes) {
        const bookingUrl = selectedRec.notes.match(
          /Booking URL: (https?:\/\/[^\s]+)/
        )?.[1];
        if (bookingUrl) {
          await Linking.openURL(bookingUrl);
        }
      }
    } catch (error) {
      console.error("Error opening booking URL:", error);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => (
    <View
      style={{
        backgroundColor: status === "available" ? "#3B82F6" : "#6B7280",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: "center",
        marginTop: 4,
      }}
    >
      <Text
        className="font-lato"
        style={{
          color: "white",
          fontSize: 12,
          fontWeight: "500",
          textTransform: "capitalize",
        }}
      >
        {status}
      </Text>
    </View>
  );

  const TypeBadge = ({ type }: { type: string }) => (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#D1D5DB",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
      }}
    >
      <Text
        className="font-lato"
        style={{ color: "#6B7280", fontSize: 12, textTransform: "capitalize" }}
      >
        {type}
      </Text>
    </View>
  );

  return (
    <CustomModal
      title={justInfo ? "Trip item info" : "Recommendation Info"}
      show={selectedRec !== null}
      setShow={() => setSelectedRec(null)}
    >
      {selectedRec ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            paddingBottom: 0,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              width: width - 40,
              overflow: "hidden",
            }}
          >
            <View style={{ padding: 20, paddingBottom: 0 }}>
            {type === "flight" && isFlightData(selectedRec) && (
    <View>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        {selectedRec.airline ? (
          <Text
            className="font-lato"
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#111827",
            }}
          >
            {selectedRec.airline}
          </Text>
        ) : null}
        <Text
          className="font-lato"
          style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}
        >
          Flight {selectedRec.flight_number}
        </Text>
        <StatusBadge status={selectedRec.status} />
        {selectedRec.seat_number && (
          <Text
            className="font-lato"
            style={{
              fontSize: 12,
              color: "#6B7280",
              marginTop: 4,
            }}
          >
            Seat: {selectedRec.seat_number}
          </Text>
        )}
      </View>

      {/* Flight Route Section */}
      <View
        style={{
          backgroundColor: "#F9FAFB",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text
              className="font-lato"
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#111827",
              }}
            >
              {selectedRec.origin_airport}
            </Text>
            <Text
              className="font-lato"
              style={{
                fontSize: 14,
                color: "#6B7280",
                marginTop: 2,
              }}
            >
              {selectedRec.origin_city}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={12}
                color="#6B7280"
              />
              <Text
                className="font-lato"
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  marginLeft: 4,
                }}
              >
                {formatDate(selectedRec.departure_date)}
              </Text>
            </View>
            {selectedRec.departure_time ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                <Ionicons
                  name="time-outline"
                  size={12}
                  color="#6B7280"
                />
                <Text
                  className="font-lato"
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    marginLeft: 4,
                  }}
                >
                  {formatTime(selectedRec.departure_time)}
                </Text>
              </View>
            ) : null}
          </View>
          <View
            style={{
              alignItems: "center",
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{
                height: 1,
                width: 40,
                backgroundColor: "#D1D5DB",
                position: "relative",
              }}
            />
            <Ionicons
              name="airplane"
              size={16}
              color="#3B82F6"
              style={{ position: "absolute", top: -8 }}
            />
          </View>
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text
              className="font-lato"
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#111827",
              }}
            >
              {selectedRec.destination_airport}
            </Text>
            <Text
              className="font-lato"
              style={{
                fontSize: 14,
                color: "#6B7280",
                marginTop: 2,
              }}
            >
              {selectedRec.destination_city}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={12}
                color="#6B7280"
              />
              <Text
                className="font-lato"
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  marginLeft: 4,
                }}
              >
                {formatDate(selectedRec.arrival_date)}
              </Text>
            </View>
            {selectedRec.arrival_time ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                <Ionicons
                  name="time-outline"
                  size={12}
                  color="#6B7280"
                />
                <Text
                  className="font-lato"
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    marginLeft: 4,
                  }}
                >
                  {formatTime(selectedRec.arrival_time)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {/* Transit Information Section */}
      {selectedRec.is_direct === false && selectedRec.transit_summary && (
        <View
          style={{
            backgroundColor: "#FEF3C7",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Ionicons
              name="swap-horizontal-outline"
              size={16}
              color="#D97706"
            />
            <Text
              className="font-lato"
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#D97706",
                marginLeft: 6,
              }}
            >
              Connection Flight
            </Text>
          </View>
          <Text
            className="font-lato"
            style={{
              fontSize: 12,
              color: "#92400E",
              lineHeight: 16,
            }}
          >
            {selectedRec.transit_summary}
          </Text>
          {selectedRec.segments_count && selectedRec.segments_count > 1 && (
            <Text
              className="font-lato"
              style={{
                fontSize: 11,
                color: "#92400E",
                marginTop: 4,
              }}
            >
              {selectedRec.segments_count} segments
            </Text>
          )}
        </View>
      )}

      {/* Flight Duration */}
      {selectedRec.total_duration_formatted && (
        <View
          style={{
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F3F4F6",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
            }}
          >
            <Ionicons
              name="time-outline"
              size={14}
              color="#6B7280"
            />
            <Text
              className="font-lato"
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginLeft: 4,
              }}
            >
              Total duration: {selectedRec.total_duration_formatted}
            </Text>
          </View>
        </View>
      )}

      {/* Price Section */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <View
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Ionicons name="cash-outline" size={20} color="#10B981" />
          <Text
            className="font-lato"
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#10B981",
              marginLeft: 4,
            }}
          >
            {selectedRec.price}
          </Text>
          <Text
            className="font-lato"
            style={{
              fontSize: 14,
              color: "#6B7280",
              marginLeft: 4,
            }}
          >
            {selectedRec.currency}
          </Text>
        </View>
        {selectedRec.is_return_flight && (
          <Text
            className="font-lato"
            style={{
              fontSize: 12,
              color: "#6B7280",
              marginTop: 4,
            }}
          >
            Return Flight
          </Text>
        )}
      </View>
    </View>
  )}
            {/* 
              {type === "flight" && isFlightData(selectedRec) && (
                <View>
                  <View style={{ alignItems: "center", marginBottom: 20 }}>
                    {selectedRec.airline ? (
                      <Text
                        className="font-lato"
                        style={{
                          fontSize: 18,
                          fontWeight: "600",
                          color: "#111827",
                        }}
                      >
                        {selectedRec.airline}
                      </Text>
                    ) : null}
                    <Text
                      className="font-lato"
                      style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}
                    >
                      Flight {selectedRec.flight_number}
                    </Text>
                    <StatusBadge status={selectedRec.status} />
                    {selectedRec.seat_number && (
                      <Text
                        className="font-lato"
                        style={{
                          fontSize: 12,
                          color: "#6B7280",
                          marginTop: 4,
                        }}
                      >
                        Seat: {selectedRec.seat_number}
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      backgroundColor: "#F9FAFB",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 20,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View style={{ alignItems: "center", flex: 1 }}>
                        <Text
                          className="font-lato"
                          style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            color: "#111827",
                          }}
                        >
                          {selectedRec.origin_airport}
                        </Text>
                        <Text
                          className="font-lato"
                          style={{
                            fontSize: 14,
                            color: "#6B7280",
                            marginTop: 2,
                          }}
                        >
                          {selectedRec.origin_city}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 4,
                          }}
                        >
                          <Ionicons
                            name="calendar-outline"
                            size={12}
                            color="#6B7280"
                          />
                          <Text
                            className="font-lato"
                            style={{
                              fontSize: 12,
                              color: "#6B7280",
                              marginLeft: 4,
                            }}
                          >
                            {formatDate(selectedRec.departure_date)}
                          </Text>
                        </View>
                        {selectedRec.departure_time ? (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: 2,
                            }}
                          >
                            <Ionicons
                              name="time-outline"
                              size={12}
                              color="#6B7280"
                            />
                            <Text
                              className="font-lato"
                              style={{
                                fontSize: 12,
                                color: "#6B7280",
                                marginLeft: 4,
                              }}
                            >
                              {formatTime(selectedRec.departure_time)}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                      <View
                        style={{
                          alignItems: "center",
                          paddingHorizontal: 16,
                        }}
                      >
                        <View
                          style={{
                            height: 1,
                            width: 40,
                            backgroundColor: "#D1D5DB",
                            position: "relative",
                          }}
                        />
                        <Ionicons
                          name="airplane"
                          size={16}
                          color="#3B82F6"
                          style={{ position: "absolute", top: -8 }}
                        />
                      </View>
                      <View style={{ alignItems: "center", flex: 1 }}>
                        <Text
                          className="font-lato"
                          style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            color: "#111827",
                          }}
                        >
                          {selectedRec.destination_airport}
                        </Text>
                        <Text
                          className="font-lato"
                          style={{
                            fontSize: 14,
                            color: "#6B7280",
                            marginTop: 2,
                          }}
                        >
                          {selectedRec.destination_city}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 4,
                          }}
                        >
                          <Ionicons
                            name="calendar-outline"
                            size={12}
                            color="#6B7280"
                          />
                          <Text
                            className="font-lato"
                            style={{
                              fontSize: 12,
                              color: "#6B7280",
                              marginLeft: 4,
                            }}
                          >
                            {formatDate(selectedRec.arrival_date)}
                          </Text>
                        </View>
                        {selectedRec.arrival_time ? (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: 2,
                            }}
                          >
                            <Ionicons
                              name="time-outline"
                              size={12}
                              color="#6B7280"
                            />
                            <Text
                              className="font-lato"
                              style={{
                                fontSize: 12,
                                color: "#6B7280",
                                marginLeft: 4,
                              }}
                            >
                              {formatTime(selectedRec.arrival_time)}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </View>
                  <View style={{ alignItems: "center", marginBottom: 20 }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Ionicons name="cash-outline" size={20} color="#10B981" />
                      <Text
                        className="font-lato"
                        style={{
                          fontSize: 28,
                          fontWeight: "bold",
                          color: "#10B981",
                          marginLeft: 4,
                        }}
                      >
                        {selectedRec.price}
                      </Text>
                      <Text
                        className="font-lato"
                        style={{
                          fontSize: 14,
                          color: "#6B7280",
                          marginLeft: 4,
                        }}
                      >
                        {selectedRec.currency}
                      </Text>
                    </View>
                    {selectedRec.is_return_flight && (
                      <Text
                        className="font-lato"
                        style={{
                          fontSize: 12,
                          color: "#6B7280",
                          marginTop: 4,
                        }}
                      >
                        Return Flight
                      </Text>
                    )}
                  </View>
                </View>
              )} */}

              {type === "stay" && isStayData(selectedRec) && (
                <View>
                  {selectedRec.photo && (
                    <View style={{ marginBottom: 16 }}>
                      <Image
                        source={{ uri: selectedRec.photo }}
                        style={{
                          width: "100%",
                          height: 120,
                          borderRadius: 12,
                        }}
                        resizeMode="cover"
                      />
                    </View>
                  )}
                  <View style={{ marginBottom: 16 }}>
                    <Text
                      className="font-lato"
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        color: "#111827",
                        lineHeight: 24,
                        marginBottom: 4,
                      }}
                    >
                      {selectedRec.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 2,
                      }}
                    >
                      <Ionicons
                        name="location-outline"
                        size={16}
                        color="#6B7280"
                      />
                      <Text
                        className="font-lato"
                        style={{
                          fontSize: 14,
                          color: "#6B7280",
                          marginLeft: 4,
                        }}
                      >
                        {selectedRec.address}
                      </Text>
                    </View>
                    <Text
                      className="font-lato"
                      style={{
                        fontSize: 14,
                        color: "#6B7280",
                        textTransform: "capitalize",
                      }}
                    >
                      {selectedRec.city}, {selectedRec.country}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <TypeBadge type={selectedRec.type} />
                      <View style={{ marginLeft: 8 }}>
                        <StatusBadge status={selectedRec.status} />
                      </View>
                      {selectedRec.rating && selectedRec.rating > 0 && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginLeft: 8,
                          }}
                        >
                          <Ionicons name="star" size={16} color="#F59E0B" />
                          <Text
                            className="font-lato"
                            style={{
                              fontSize: 14,
                              fontWeight: "500",
                              marginLeft: 2,
                            }}
                          >
                            {selectedRec.rating}
                          </Text>
                        </View>
                      )}
                      {selectedRec.room_type && (
                        <View style={{ marginLeft: 8 }}>
                          <TypeBadge type={selectedRec.room_type} />
                        </View>
                      )}
                    </View>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#F9FAFB",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 16,
                    }}
                  >
                    {[
                      {
                        icon: "calendar-outline",
                        label: "Check-in",
                        value: formatDate(selectedRec.check_in_date),
                        subValue: formatTime(selectedRec.check_in_time),
                      },
                      {
                        icon: "calendar-outline",
                        label: "Check-out",
                        value: formatDate(selectedRec.check_out_date),
                        subValue: formatTime(selectedRec.check_out_time),
                      },
                      {
                        icon: "people-outline",
                        label: "Guests",
                        value: selectedRec.guests_count.toString(),
                      },
                      {
                        icon: "bed-outline",
                        label: "Nights",
                        value: selectedRec.nights_count.toString(),
                      },
                    ].map((item, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: index < 3 ? 12 : 0,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Ionicons
                            name={item.icon as any}
                            size={16}
                            color="#6B7280"
                          />
                          <Text
                            className="font-lato"
                            style={{
                              fontSize: 14,
                              color: "#6B7280",
                              marginLeft: 8,
                            }}
                          >
                            {item.label}
                          </Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                          <Text
                            className="font-lato"
                            style={{ fontSize: 14, fontWeight: "500" }}
                          >
                            {item.value}
                          </Text>
                          {item.subValue && (
                            <Text
                              className="font-lato"
                              style={{ fontSize: 12, color: "#6B7280" }}
                            >
                              {item.subValue}
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>

                  {selectedRec.amenities &&
                    selectedRec.amenities.length > 0 && (
                      <View style={{ marginBottom: 16 }}>
                        <Text
                          className="font-lato"
                          style={{
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#111827",
                            marginBottom: 8,
                          }}
                        >
                          Amenities
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 8,
                          }}
                        >
                          {selectedRec.amenities.map((amenity, index) => (
                            <View
                              key={index}
                              style={{
                                backgroundColor: "#F3F4F6",
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 6,
                              }}
                            >
                              <Text
                                className="font-lato"
                                style={{
                                  fontSize: 12,
                                  color: "#374151",
                                }}
                              >
                                {amenity}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                  {(selectedRec.email || selectedRec.phone) && (
                    <View
                      style={{
                        backgroundColor: "#F9FAFB",
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 16,
                      }}
                    >
                      <Text
                        className="font-lato"
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#111827",
                          marginBottom: 8,
                        }}
                      >
                        Contact Information
                      </Text>
                      {selectedRec.email && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: selectedRec.phone ? 8 : 0,
                          }}
                        >
                          <Ionicons
                            name="mail-outline"
                            size={16}
                            color="#6B7280"
                          />
                          <Text
                            className="font-lato"
                            style={{
                              fontSize: 14,
                              color: "#6B7280",
                              marginLeft: 8,
                            }}
                          >
                            {selectedRec.email}
                          </Text>
                        </View>
                      )}
                      {selectedRec.phone && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Ionicons
                            name="call-outline"
                            size={16}
                            color="#6B7280"
                          />
                          <Text
                            className="font-lato"
                            style={{
                              fontSize: 14,
                              color: "#6B7280",
                              marginLeft: 8,
                            }}
                          >
                            {selectedRec.phone}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  <View style={{ alignItems: "center", marginBottom: 16 }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Ionicons name="cash-outline" size={20} color="#10B981" />
                      <Text
                        className="font-lato"
                        style={{
                          fontSize: 28,
                          fontWeight: "bold",
                          color: "#10B981",
                          marginLeft: 4,
                        }}
                      >
                        {Math.round(selectedRec.total_price)}
                      </Text>
                      <Text
                        className="font-lato"
                        style={{
                          fontSize: 14,
                          color: "#6B7280",
                          marginLeft: 4,
                        }}
                      >
                        {selectedRec.currency}
                      </Text>
                    </View>
                    <Text
                      className="font-lato"
                      style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}
                    >
                      ${Math.round(selectedRec.price_per_night)}/night
                    </Text>
                  </View>
                </View>
              )}
              {swap ? (
                <View style={{ flexDirection: "row", marginBottom: 12 }}>
                  <TouchableOpacity
                    onPress={() => (selectedRec ? onSwap(selectedRec) : null)}
                    style={{
                      flex: 1,
                      backgroundColor: "#266bd3",
                      borderWidth: 1,
                      borderColor: "#266bd3",
                      paddingVertical: 12,
                      borderRadius: 8,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: "white",
                      }}
                      className="font-lato"
                    >
                      Swap {type.split("")[0].toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              {!justInfo && !swap ? (
                <View style={{ flexDirection: "row", marginBottom: 12 }}>
                  <TouchableOpacity
                    onPress={() => (selectedRec ? onAdd(selectedRec) : null)}
                    style={{
                      flex: 1,
                      backgroundColor: "transparent",
                      borderWidth: 1,
                      borderColor: "#D1D5DB",
                      paddingVertical: 12,
                      borderRadius: 8,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      className="font-lato"
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      Add {type.split("")[0].toUpperCase() + type.slice(1)} to
                      Trip
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                !swap && (
                  <View style={{ flexDirection: "row", marginBottom: 12 }}>
                    <TouchableOpacity
                      onPress={() => {
                        if (type && selectedRec && selectedRec.id) {
                          removeTripItem(
                            type === "flight" ? "flights" : "stays",
                            selectedRec.id.toString()
                          )
                            .then(({ data, error }) => {
                              if (error) {
                                Alert.alert(
                                  "Error",
                                  "Failed to remove trip item. Please try again later."
                                );
                              } else {
                                refetch();
                                setSelectedRec(null);
                              }
                            })
                            .catch(() => {
                              Alert.alert(
                                "Error",
                                "Failed to remove trip item. Please try again later."
                              );
                            });
                        }
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: "#f1254e",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignContent: "center",
                        gap: 6,
                        borderWidth: 1,
                        borderColor: "#f1254e",
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: "center",
                      }}
                    >
                      <Ionicons name="trash" size={24} color="white" />
                      <Text
                        className="font-lato"
                        style={{
                          fontSize: 16,
                          fontWeight: "500",
                          color: "#ffffff",
                        }}
                      >
                        Remove {type.split("")[0].toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )
              )}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setSelectedRec(null)}
                  style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                >
                  <Text
                    className="font-lato"
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleBooking}
                  style={{
                    flex: 1,
                    backgroundColor: "#FF8CBE",
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="open-outline" size={16} color="white" />
                  <Text
                    className="font-lato"
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: "white",
                      marginLeft: 8,
                    }}
                  >
                    Book Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* </ScrollView> */}
          </View>
        </View>
      ) : null}
    </CustomModal>
  );
};

export default RecommendationInfo;
