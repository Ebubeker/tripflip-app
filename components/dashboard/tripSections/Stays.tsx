import { supabase } from "@/lib/supabase";
import { formatDateRange } from "@/lib/utils/dateFormatter";
import { findTotalPrice } from "@/lib/utils/tripDetails";
import { Flight, Stay } from "@/type/recommendation";
import { Hotel, PlusIcon, XIcon } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { v4 } from "uuid";
import AddStayModal from "./AddStayModal";
import StayItem from "./StayItem";
import RecommendationInfo from "./recommendation/RecommendationInfo";

interface StaysProps {
  tripId?: string;
  recommendedStay?: Stay;
  recommendedStays?: Stay[];
  recommendationsLoading: boolean;
  stays: any;
  loading: boolean;
  refetch: () => void;
  failed: boolean;
  recommendationRefetch: () => void;
}

function formatStayForDatabase(stayData: Stay, tripId: string) {
  return {
    trip_id: tripId,
    name: stayData.name,
    type: stayData.type,
    address: stayData.address,
    city: stayData.city,
    country: stayData.country,
    check_in_date: stayData.check_in_date,
    check_in_time: stayData.check_in_time,
    check_out_date: stayData.check_out_date,
    check_out_time: stayData.check_out_time,
    nights_count: stayData.nights_count,
    price_per_night: stayData.price_per_night,
    total_price: stayData.total_price,
    currency: stayData.currency,
    booking_reference: stayData.booking_reference,
    room_type: stayData.room_type,
    guests_count: stayData.guests_count,
    phone: stayData.phone,
    email: stayData.email,
    website: stayData.website,
    rating: stayData.rating,
    notes: stayData.notes,
    amenities: stayData.amenities,
    // status: stayData.status,
    created_at: stayData.created_at,
    photo: stayData.photo,
    booking_link: stayData.booking_link,
  };
}

const Stays = ({
  tripId,
  stays,
  loading,
  refetch,
  recommendedStays,
  recommendedStay,
  recommendationsLoading,
  failed,
  recommendationRefetch,
}: StaysProps) => {
  const [selectedRecommendedStay, setSelectedRecommendedStay] =
    useState<Stay | null>(null);
  const [selectStay, setSelectStay] = useState<Stay | null>(null);
  const [show, setShow] = useState(false);
  const [hideRecommendations, setHideRecommendations] = useState(false);

  // const { stays, loading, refetch } = useGetStaysByTripId(tripId || "");

  const isStayData = (data: Flight | Stay | null): data is Stay => {
    return true;
  };

  const listOfStaysToRecommend = recommendedStays
    ?.slice(0, 4)
    .filter((stay) => JSON.stringify(stay) !== JSON.stringify(recommendedStay));

  const formattedDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const addStayToTrip = (stay: Stay | Flight) => {
    if (isStayData(stay) && tripId) {
      const stayData = formatStayForDatabase(stay, tripId);
      supabase
        .from("stays")
        .insert({
          id: v4(),
          ...stayData,
        })
        .then(({ data, error }) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Flight added successfully:", data);
            refetch();
            setSelectedRecommendedStay(null);
          }
        });
    }
  };

  // const showTripFailed = useCallback(() => {
  //   console.log("Failed:", failed);

  //   if (hideRecommendations) {
  //     return false;
  //   } else {

  //     if (
  //       stays &&
  //       stays.length >= 1 &&

  //     ) {
  //       return false;
  //     } else {
  //       console.log("hiiiii");
  //       return failed;
  //     }
  //   }

  //   // return false;
  // }, [failed, flights]);

  return (
    <View>
      <View className="flex-row items-center gap-3">
        <Hotel />
        <Text className="text-xl font-lato-bold">Stays</Text>
      </View>
      {!loading && stays && stays.length ? (
        <View style={{ marginTop: 12 }}>
          {stays.map((staysData: Stay, index: number) => (
            <StayItem
              key={index}
              stay={staysData}
              onPress={() => setSelectStay(staysData)}
            />
          ))}
        </View>
      ) : (
        <View className="items-center justify-center" style={{ height: 60 }}>
          <Text style={{ color: "#00000080" }} className="font-lato">
            No stays added yet.
          </Text>
        </View>
      )}
      <TouchableOpacity onPress={() => setShow(true)}>
        <View
          className="items-center border border-dashed border-primary rounded-2xl py-3"
          style={{ gap: 4 }}
        >
          <View
            className="bg-primary rounded-full items-center justify-center"
            style={{ width: 30, height: 30 }}
          >
            <PlusIcon className="text-white" color="white" size={24} />
          </View>
          <Text className="text-sm text-gray-500 font-lato">Add stay</Text>
        </View>
      </TouchableOpacity>
      {!failed ? (
        <></>
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 12,
            padding: 12,
            gap: 8,
            flexDirection: "column",
          }}
        >
          <Text className="text-red-500 font-lato">
            Failed to load recommendations.
          </Text>
          <TouchableOpacity onPress={() => recommendationRefetch()}>
            <View
              style={{
                backgroundColor: "#FF8CBE",
                padding: 10,
                borderRadius: 8,
                width: 150,
              }}
            >
              <Text
                style={{ textAlign: "center" }}
                className="font-lato-bold text-white"
              >
                Refetch Flights
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {!recommendationsLoading &&
      !(stays && stays.length) &&
      recommendedStays?.length &&
      !hideRecommendations ? (
        <View
          style={{
            marginTop: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text
              className="font-lato-bold"
              style={{ fontSize: 10, fontWeight: "bold", marginBottom: 4 }}
            >
              Recommended
            </Text>
            <TouchableOpacity onPress={() => setHideRecommendations(true)}>
              <XIcon size={12} style={{ cursor: "pointer" }} />
            </TouchableOpacity>
          </View>
          {(!stays || !(stays && stays.length)) && recommendedStay ? (
            <TouchableOpacity
              onPress={() => setSelectedRecommendedStay(recommendedStay)}
              key={v4()}
              style={{
                padding: 10,
                backgroundColor: "#d268b640",
                borderWidth: 3,
                borderColor: "#ffd500",
              }}
              className="mb-3 flex-row gap-3 items-center rounded-2xl"
            >
              <Image
                src={recommendedStay.photo}
                className="rounded-xl"
                style={{ borderRadius: 12 }}
                width={80}
                height={80}
              />
              <View>
                <Text
                  className="font-lato-bold text-sm"
                  style={{ marginBottom: 2, width: 200 }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {recommendedStay.name}
                </Text>
                <Text
                  className="font-lato-bold"
                  style={{ color: "#00000080", marginBottom: 6 }}
                >
                  {recommendedStay.type[0].toUpperCase()}
                  {recommendedStay.type.slice(1)}
                </Text>
                <Text
                  className="font-lato-bold text-sm"
                  style={{ marginBottom: 6 }}
                >
                  USD{" "}
                  {findTotalPrice(
                    recommendedStay.price_per_night,
                    recommendedStay.check_in_date,
                    recommendedStay.check_out_date
                  )}
                </Text>
                <View className="flex-row items-center" style={{ gap: 6 }}>
                  <Text
                    style={{ fontSize: 11, color: "#00000090" }}
                    className="font-lato"
                  >
                    {formatDateRange(
                      recommendedStay.check_in_date,
                      recommendedStay.check_out_date
                    )}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : null}
          {(!stays || !(stays && stays.length)) && recommendedStays
            ? listOfStaysToRecommend?.slice(0, 2).map((stay) => (
                <TouchableOpacity
                  onPress={() => setSelectedRecommendedStay(stay)}
                  key={v4()}
                  style={{
                    padding: 10,
                  }}
                  className="mb-3 flex-row gap-3 items-center rounded-2xl border border-primary"
                >
                  <Image
                    src={stay.photo}
                    className="rounded-xl"
                    style={{ borderRadius: 12 }}
                    width={80}
                    height={80}
                  />
                  <View>
                    <Text
                      className="font-lato-bold text-sm"
                      style={{ marginBottom: 2, width: 150 }}
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
                    <Text
                      className="font-lato-bold text-sm"
                      style={{ marginBottom: 6 }}
                    >
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
                        {formatDateRange(
                          stay.check_in_date,
                          stay.check_out_date
                        )}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            : null}
        </View>
      ) : (
        recommendationsLoading && (
          <View
            style={{
              height: 150,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color="#d268b6" />
            <Text>Generating Recommendations</Text>
          </View>
        )
      )}
      <RecommendationInfo
        selectedRec={
          selectedRecommendedStay ? selectedRecommendedStay : selectStay
        }
        setSelectedRec={
          selectedRecommendedStay ? setSelectedRecommendedStay : setSelectStay
        }
        type="stay"
        onAdd={addStayToTrip}
        justInfo={Boolean(selectStay)}
        refetch={refetch}
      />
      <AddStayModal
        tripId={tripId}
        show={show}
        setShow={setShow}
        refetch={refetch}
      />
    </View>
  );
};

export default Stays;
