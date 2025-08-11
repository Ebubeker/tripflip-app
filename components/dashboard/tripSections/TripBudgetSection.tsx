import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface BudgetData {
  maxBudget: number;
  currentSpent: number;
  currency: string;
  aiRecommendationPrice?: number;
}

interface TripBudgetSectionProps {
  budgetData: BudgetData;
  hasRecommendations?: boolean;
}

const TripBudgetSection = ({
  budgetData,
  hasRecommendations = false,
}: TripBudgetSectionProps) => {
  if (!budgetData) {
    return null;
  }

  const {
    maxBudget = 0,
    currentSpent = 0,
    currency = "USD",
    aiRecommendationPrice,
  } = budgetData;

  const safeAiRecommendationPrice = aiRecommendationPrice ?? 0;

  const remainingBudget = maxBudget - currentSpent;
  const budgetPercentage = maxBudget > 0 ? (currentSpent / maxBudget) * 100 : 0;
  const totalWithRecommendations = currentSpent + safeAiRecommendationPrice;
  const remainingAfterRecommendations = maxBudget - totalWithRecommendations;

  const getBudgetColor = (percentage: number) => {
    if (percentage >= 90) return "#EF4444";
    if (percentage >= 70) return "#F59E0B";
    return "#10B981";
  };

  const formatCurrency = (amount: number) => {
    const validAmount = isNaN(amount) || amount === null || amount === undefined ? 0 : Number(amount);
    const result = `${Math.round(validAmount)} ${currency || "USD"}`;
    return result;
  };

  return (
    <View
      style={{
        backgroundColor: "#79e10925",
        marginHorizontal: 16,
        marginVertical: 16,
        borderRadius: 16,
        padding: 16,
        borderColor: "#79e109",
        borderWidth: 2,
        borderStyle: "dashed",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Ionicons name="wallet-outline" size={20} color="#456522" />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#456522",
            marginLeft: 8,
          }}
        >
          Trip Budget
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 12,
              color: "#6B7280",
              marginBottom: 2,
            }}
          >
            Current Spent
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: getBudgetColor(budgetPercentage),
            }}
          >
            {formatCurrency(currentSpent)}
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 12,
              color: "#6B7280",
              marginBottom: 2,
            }}
          >
            of
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "#456522",
            }}
          >
            {formatCurrency(maxBudget)}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontSize: 12,
              color: "#6B7280",
              marginBottom: 2,
            }}
          >
            Remaining
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: remainingBudget >= 0 ? "#10B981" : "#EF4444",
            }}
          >
            {formatCurrency(remainingBudget)}
          </Text>
        </View>
      </View>

      <View
        style={{
          height: 8,
          backgroundColor: "#ffffff",
          borderRadius: 4,
          marginBottom: hasRecommendations && safeAiRecommendationPrice > 0 ? 16 : 0,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${Math.min(budgetPercentage, 100)}%`,
            backgroundColor: getBudgetColor(budgetPercentage),
            borderRadius: 4,
          }}
        />
      </View>

      {hasRecommendations && safeAiRecommendationPrice > 0 && (
        <View
          style={{
            backgroundColor: "#f8fafca9",
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: "#E2E8F0",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Ionicons name="sparkles" size={16} color="#8B5CF6" />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#8B5CF6",
                marginLeft: 6,
              }}
            >
              AI Best Combination
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  marginBottom: 2,
                }}
              >
                Recommended Price
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#8B5CF6",
                }}
              >
                {formatCurrency(safeAiRecommendationPrice)}
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  marginBottom: 2,
                }}
              >
                Total if Added
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color:
                    totalWithRecommendations <= maxBudget
                      ? "#10B981"
                      : "#EF4444",
                }}
              >
                {formatCurrency(totalWithRecommendations)}
              </Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  marginBottom: 2,
                }}
              >
                Budget Left
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color:
                    remainingAfterRecommendations >= 0 ? "#10B981" : "#EF4444",
                }}
              >
                {formatCurrency(remainingAfterRecommendations)}
              </Text>
            </View>
          </View>

          {remainingAfterRecommendations < 0 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
                backgroundColor: "#FEF2F2",
                padding: 8,
                borderRadius: 8,
              }}
            >
              <Ionicons name="warning" size={16} color="#EF4444" />
              <Text
                style={{
                  fontSize: 12,
                  color: "#EF4444",
                  marginLeft: 6,
                  flex: 1,
                }}
              >
                {`This combination exceeds your budget by ${formatCurrency(Math.abs(remainingAfterRecommendations))}`}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default TripBudgetSection;