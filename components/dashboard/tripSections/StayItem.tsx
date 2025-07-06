import { MinusIcon } from "lucide-react-native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export type StayType =
  | "hotel"
  | "hostel"
  | "apartment"
  | "house"
  | "resort"
  | "other";
export type StayStatus = "booked" | "confirmed" | "cancelled" | "completed";

export interface Stay {
  id: number;
  trip_id: string;
  name: string;
  type: StayType;
  address?: string;
  city?: string;
  country?: string;
  check_in_date: string;
  check_in_time: string;
  check_out_date: string;
  check_out_time: string;
  nights_count?: number;
  price_per_night?: number;
  total_price?: number;
  currency: string;
  booking_reference?: string;
  room_type?: string;
  guests_count: number;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  notes?: string;
  amenities?: Record<string, any>;
  status: StayStatus;
  created_at: string;
}

export type CreateStayInput = Omit<Stay, "id" | "created_at"> & {
  id?: never;
  created_at?: never;
};

export type UpdateStayInput = Partial<Omit<Stay, "id">> & {
  id: number;
};

const StayItem = ({ stay }: { stay: Stay }) => {
  const findTotalPrice = (
    price: number,
    startDate: string,
    endDate: string
  ): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return price * daysDiff;
  };

  const formattedDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  return (
    <TouchableOpacity className="p-4 mb-3 border flex-row gap-3 items-center border-primary rounded-2xl">
      <Image
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrC7wOWV5YhHD6pERg7OtiWxTjCmA08qLrCA&s"
        className="rounded-xl"
        style={{ borderRadius: 12 }}
        width={110}
        height={110}
      />
      <View>
        <Text className="font-lato-bold text-xl" style={{ marginBottom: 2 }}>
          {stay.name}
        </Text>
        <Text
          className="font-lato-bold"
          style={{ color: "#00000080", marginBottom: 6 }}
        >
          {stay.type[0].toUpperCase()}
          {stay.type.slice(1)}
        </Text>
        <Text className="font-lato-bold" style={{marginBottom: 6}}>
          USD{" "}
          {findTotalPrice(
            stay.price_per_night,
            stay.check_in_date,
            stay.check_out_date
          )}
        </Text>
        <View className="flex-row items-center" style={{gap: 6}}>
          <Text style={{ fontSize: 11, color: '#00000090' }} className="font-lato">
            {formattedDate(stay.check_in_date)}
          </Text>
          <MinusIcon size={10} color={'#00000090'}/>
          <Text style={{ fontSize: 11, color: '#00000090' }}>{formattedDate(stay.check_out_date)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StayItem;
