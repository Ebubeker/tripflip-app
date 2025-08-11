import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

interface SubscriptionScreenProps {
  onSelectPlan: (plan: "free" | "pro-monthly" | "pro-yearly") => void;
  onSkip?: () => void;
}

const Subscription = ({ onSelectPlan, onSkip }: SubscriptionScreenProps) => {
  const [selectedPlan, setSelectedPlan] = useState<
    "free" | "pro-monthly" | "pro-yearly"
  >("free");

  const plans = [
    {
      id: "free" as const,
      title: "Free",
      subtitle: "Perfect for trying out",
      price: "€0",
      period: "forever",
      features: [
        "Create 1 trip only",
        "Basic trip planning",
        "AI recommendations",
        "No trip editing",
        "Limited features",
      ],
      limitations: ["Only 1 trip allowed", "No editing capabilities"],
      popular: false,
      color: "#ddade6",
    },
    {
      id: "pro-monthly" as const,
      title: "Pro Monthly",
      subtitle: "Full access, billed monthly",
      price: "€5.99",
      period: "per month",
      features: [
        "Unlimited trips",
        "Full trip editing",
        "Advanced AI features",
        "Priority support",
        "Export & sharing",
        "Budget tracking",
        "Offline access",
      ],
      popular: false,
      color: "#EC4899",
    },
    {
      id: "pro-yearly" as const,
      title: "Pro Yearly",
      subtitle: "Best value - Save 27%!",
      price: "€51.99",
      period: "per year",
      originalPrice: "€71.88",
      features: [
        "Unlimited trips",
        "Full trip editing",
        "Advanced AI features",
        "Priority support",
        "Export & sharing",
        "Budget tracking",
        "Offline access",
        "2 months FREE!",
      ],
      popular: true,
      color: "#8B5CF6",
    },
  ];

  const PlanCard = ({ plan }: { plan: (typeof plans)[0] }) => {
    const isSelected = selectedPlan === plan.id;
    const isFree = plan.id === "free";

    return (
      <TouchableOpacity
        onPress={() => setSelectedPlan(plan.id)}
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          padding: 20,
          marginBottom: 16,
          borderWidth: isSelected ? 3 : 1,
          borderColor: isSelected ? plan.color : "#E5E7EB",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isSelected ? 0.15 : 0.08,
          shadowRadius: 12,
          elevation: isSelected ? 8 : 4,
          transform: [{ scale: isSelected ? 1.02 : 1 }],
        }}
      >
        {plan.popular && (
          <View
            style={{
              position: "absolute",
              top: -8,
              right: 20,
              backgroundColor: "#F59E0B",
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              MOST POPULAR
            </Text>
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: isSelected ? plan.color : "#D1D5DB",
              backgroundColor: isSelected ? plan.color : "transparent",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={14} color="white" />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#111827",
                marginBottom: 2,
              }}
            >
              {plan.title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              {plan.subtitle}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: plan.color,
            }}
          >
            {plan.price}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#6B7280",
              marginLeft: 4,
            }}
          >
            {plan.period}
          </Text>
          {plan.originalPrice && (
            <Text
              style={{
                fontSize: 14,
                color: "#9CA3AF",
                textDecorationLine: "line-through",
                marginLeft: 8,
              }}
            >
              {plan.originalPrice}
            </Text>
          )}
        </View>

        <View style={{ marginBottom: isFree ? 16 : 0 }}>
          {plan.features.map((feature, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Ionicons
                name={
                  isFree && index >= 3 ? "close-circle" : "checkmark-circle"
                }
                size={16}
                color={isFree && index >= 3 ? "#EF4444" : "#10B981"}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: isFree && index >= 3 ? "#6B7280" : "#374151",
                  textDecorationLine:
                    isFree && index >= 3 ? "line-through" : "none",
                }}
              >
                {feature}
              </Text>
            </View>
          ))}
        </View>

        {plan.limitations && (
          <View
            style={{
              backgroundColor: "#FEF2F2",
              borderRadius: 8,
              padding: 12,
              marginTop: 8,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: "#DC2626",
                marginBottom: 4,
              }}
            >
              Limitations:
            </Text>
            {plan.limitations.map((limitation, index) => (
              <Text
                key={index}
                style={{
                  fontSize: 12,
                  color: "#DC2626",
                  marginBottom: index < plan.limitations!.length - 1 ? 2 : 0,
                }}
              >
                • {limitation}
              </Text>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const topWaveHeight = Math.max(height * 0.25, 300);
  const bottomWaveHeight = Math.max(height * 0.15, 150);

  const contentPadding = height < 700 ? 20 : 40;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#EC4899" />
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

        <ScrollView
          style={{ flex: 1, zIndex: 1 }}
          contentContainerStyle={{
            paddingTop: StatusBar.currentHeight
              ? StatusBar.currentHeight + 40
              : 60,
            paddingHorizontal: 20,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Choose Your Plan
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.9)",
                textAlign: "center",
                lineHeight: 24,
              }}
            >
              Start your journey with the perfect plan for your travel needs
            </Text>
          </View>

          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}

          <TouchableOpacity
            onPress={() => onSelectPlan(selectedPlan)}
            style={{
              backgroundColor: "#EC4899",
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              marginTop: 8,
              marginBottom: 16,
              shadowColor: "#EC4899",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {selectedPlan === "free" ? "Start Free Trial" : "Subscribe Now"}
            </Text>
          </TouchableOpacity>

          {onSkip && (
            <TouchableOpacity
              onPress={onSkip}
              style={{ alignItems: "center", marginTop: 8 }}
            >
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: 16,
                  textDecorationLine: "underline",
                }}
              >
                Skip for now
              </Text>
            </TouchableOpacity>
          )}

          <View
            style={{
              alignItems: "center",
              marginTop: 24,
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                lineHeight: 18,
              }}
            >
              You can upgrade or downgrade your plan anytime. Cancel
              subscription at any time.
            </Text>
          </View>
        </ScrollView>
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
    </>
  );
};

export default Subscription;
