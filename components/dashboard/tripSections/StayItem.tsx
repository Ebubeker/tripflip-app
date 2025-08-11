import { formatDateRange } from "@/lib/utils/dateFormatter";
import { Stay } from "@/type/recommendation";
import { Image, Text, TouchableOpacity, View } from "react-native";

export type StayType =
  | "hotel"
  | "hostel"
  | "apartment"
  | "house"
  | "resort"
  | "other";
export type StayStatus = "booked" | "confirmed" | "cancelled" | "completed";

export type CreateStayInput = Omit<Stay, "id" | "created_at"> & {
  id?: never;
  created_at?: never;
};

export type UpdateStayInput = Partial<Omit<Stay, "id">> & {
  id: number;
};

const StayItem = ({ stay, onPress }: { stay: Stay; onPress: () => void }) => {
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

  return (
    <TouchableOpacity
      className="p-4 mb-3 border flex-row gap-3 items-center border-primary rounded-2xl"
      onPress={() => onPress()}
    >
      <Image
        src={stay.photo}
        className="rounded-xl"
        style={{ borderRadius: 12 }}
        width={110}
        height={110}
      />
      <View>
        <Text
          className="font-lato-bold text-xl"
          style={{ marginBottom: 2, width: 220 }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {stay.name}
        </Text>
        <Text
          className="font-lato-bold"
          style={{ color: "#00000080", marginBottom: 6 }}
        >
          {stay.type[0].toUpperCase()}
          {stay.type.slice(1)}
        </Text>
        <Text className="font-lato-bold" style={{ marginBottom: 6 }}>
          USD{" "}
          {findTotalPrice(
            stay.price_per_night,
            stay.check_in_date,
            stay.check_out_date
          )}
        </Text>
        <View className="flex-row items-center" style={{ gap: 6 }}>
          <Text
            style={{ fontSize: 11, color: "#00000090" }}
            className="font-lato"
          >
            {formatDateRange(stay.check_in_date, stay.check_out_date)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StayItem;
