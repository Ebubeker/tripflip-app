import CustomModal from "@/components/ui/Modal";
import { insertFlight } from "@/lib/api/trip";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { ArrowLeft } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dimensions,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import GetRecommendations from "./recommendation/GetRecommendations";

interface AddFlightModalProps {
  tripId: string;
  show: boolean;
  setShow: (show: boolean) => void;
  refetch: () => void;
}

interface FlightFormData {
  flightNumber?: string;
  price: string;
  fromAirport: string;
  toAirport: string;
  startDate: Date;
  endDate: Date;
}

const AddFlightModal = ({
  tripId,
  show,
  setShow,
  refetch,
}: AddFlightModalProps) => {
  const [showGetRecommendations, setGetRecommendations] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [hasSelectedStart, setHasSelectedStart] = useState(false);
  const [hasSelectedEnd, setHasSelectedEnd] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FlightFormData>({
    defaultValues: {
      flightNumber: "",
      price: "",
      fromAirport: "",
      toAirport: "",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const modalWidth = Dimensions.get("window").width - 80;

  const onSubmit = (data: FlightFormData) => {
    const formattedData = {
      flightNumber: data.flightNumber,
      departure_date: data.startDate,
      arrival_date: data.endDate,
      from_location: data.fromAirport,
      to_location: data.toAirport,
      price: data.price,
    };
    insertFlight(
      tripId,
      formattedData.flightNumber,
      formattedData.price,
      formattedData.from_location,
      formattedData.to_location,
      formattedData.departure_date,
      formattedData.arrival_date
    )
      .then((data) => {
        if(data.error){
          console.log(data.error);
          refetch();
          reset();
          setHasSelectedStart(false);
          setHasSelectedEnd(false);
          setShow(false);
        }
      })
      .catch((error) => {
        console.error("Error inserting flight:", error);
      });
  };

  const onStartDateChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === "android") {
        setShowStartPicker(false);
      }
      if (event.type === "set" && selectedDate) {
        setValue("startDate", selectedDate);
        setHasSelectedStart(true);
        if (Platform.OS === "ios") {
          setShowStartPicker(false);
        }
      }
    },
    [setValue]
  );

  const onEndDateChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === "android") {
        setShowEndPicker(false);
      }
      if (event.type === "set" && selectedDate) {
        setValue("endDate", selectedDate);
        setHasSelectedEnd(true);
        if (Platform.OS === "ios") {
          setShowEndPicker(false);
        }
      }
    },
    [setValue]
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const closeDatePickers = () => {
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  const renderDatePicker = (
    show: boolean,
    value: Date,
    onChange: (event: DateTimePickerEvent, date?: Date) => void,
    minimumDate?: Date
  ) => {
    if (!show) return null;

    if (Platform.OS === "ios") {
      return (
        <Modal
          transparent={true}
          animationType="slide"
          visible={show}
          style={{ zIndex: 1000 }}
          onRequestClose={closeDatePickers}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingBottom: 34,
                width: "100%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(0,0,0,0.1)",
                }}
              >
                <TouchableOpacity onPress={closeDatePickers}>
                  <Text style={{ fontSize: 16, color: "#007AFF" }}>Cancel</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: "600" }}>
                  Select Date
                </Text>
                <TouchableOpacity onPress={closeDatePickers}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#007AFF",
                      fontWeight: "600",
                    }}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="items-center">
                <DateTimePicker
                  value={value}
                  mode="date"
                  display="spinner"
                  onChange={onChange}
                  minimumDate={minimumDate}
                  style={{
                    backgroundColor: "white",
                    width: "100%",
                    height: 216,
                    zIndex: 1000,
                  }}
                  textColor="black"
                  themeVariant="light"
                />
              </View>
            </View>
          </View>
        </Modal>
      );
    }

    return (
      <DateTimePicker
        value={value}
        mode="date"
        display="default"
        style={{ zIndex: 1000 }}
        onChange={onChange}
        minimumDate={minimumDate}
      />
    );
  };

  return (
    <CustomModal show={show} setShow={setShow} title="Add a flight">
      <View>
        {!showGetRecommendations ? (
          <>
            <TouchableOpacity
              className="bg-primary py-3 rounded-lg w-full"
              onPress={() => setGetRecommendations(true)}
            >
              <Text className="text-white font-semibold text-center text-base font-lato-bold">
                Get Recommendations
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 16,
                opacity: 0.5,
              }}
            >
              <Text
                className="font-lato text-sm border p-2 rounded-full"
                style={{ paddingTop: 3.5, paddingBottom: 5 }}
              >
                or
              </Text>
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => setGetRecommendations(false)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <ArrowLeft color={"#FF8CBE"} />
              <Text className="font-lato text-xl">Go Back</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      {showGetRecommendations ? (
        <GetRecommendations
          type="flight"
          fetch
          tripId={tripId}
          refetch={refetch}
          setShow={setShow}
        />
      ) : (
        <>
          <View className="mb-4">
            <Controller
              control={control}
              name="flightNumber"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="border px-4 py-3 rounded-md border-black/20 w-full text-base font-lato"
                  style={{
                    height: 48,
                    paddingVertical: Platform.OS === "ios" ? 12 : 8,
                    paddingTop: Platform.OS === "ios" ? 8 : 12,
                    lineHeight: Platform.OS === "ios" ? 20 : undefined,
                    borderColor: errors.flightNumber
                      ? "red"
                      : "rgba(0,0,0,0.2)",
                  }}
                  placeholder="Flight Number"
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="rgba(0,0,0,0.5)"
                />
              )}
            />
            {errors.flightNumber && (
              <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                {errors.flightNumber.message}
              </Text>
            )}
            {/* <Text
          className="text-primary font-lato-bold"
          style={{ marginTop: 4, fontSize: 11 }}
        >
          Autocomplete
        </Text> */}
          </View>

          <Controller
            control={control}
            name="price"
            rules={{
              required: "Price is required",
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Please enter a valid price",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <TextInput
                  className="border px-4 py-3 rounded-md border-black/20 w-full text-base font-lato"
                  style={{
                    height: 48,
                    paddingVertical: Platform.OS === "ios" ? 12 : 8,
                    paddingTop: Platform.OS === "ios" ? 8 : 12,
                    lineHeight: Platform.OS === "ios" ? 20 : undefined,
                    borderColor: errors.price ? "red" : "rgba(0,0,0,0.2)",
                  }}
                  keyboardType="numeric"
                  placeholder="Price"
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="rgba(0,0,0,0.5)"
                />
                {errors.price && (
                  <Text
                    style={{ color: "red", fontSize: 12, marginBottom: 16 }}
                  >
                    {errors.price.message}
                  </Text>
                )}
              </View>
            )}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <View style={{ width: modalWidth * 0.5 - 6 }}>
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                style={{
                  height: 48,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.2)",
                  borderRadius: 4,
                  paddingHorizontal: 12,
                  justifyContent: "center",
                  backgroundColor: "white",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: hasSelectedStart ? "black" : "rgba(0,0,0,0.5)",
                  }}
                >
                  {hasSelectedStart
                    ? `Start Date: ${formatDate(startDate)}`
                    : "Select Start Date"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ width: modalWidth * 0.5 - 6 }}>
              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                className="w-full"
                style={{
                  height: 48,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.2)",
                  borderRadius: 4,
                  paddingHorizontal: 12,
                  justifyContent: "center",
                  backgroundColor: "white",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: hasSelectedEnd ? "black" : "rgba(0,0,0,0.5)",
                  }}
                >
                  {hasSelectedEnd
                    ? `End Date: ${formatDate(endDate)}`
                    : "Select End Date"}
                </Text>
              </TouchableOpacity>
            </View>

            {renderDatePicker(
              showStartPicker,
              startDate,
              onStartDateChange,
              new Date()
            )}
            {renderDatePicker(
              showEndPicker,
              endDate,
              onEndDateChange,
              startDate
            )}
          </View>

          <View
            className="flex-row"
            style={{ justifyContent: "space-between", marginBottom: 16 }}
          >
            <Controller
              control={control}
              name="fromAirport"
              rules={{
                required: "From airport is required",
                minLength: {
                  value: 3,
                  message: "Code must be at least 3 char",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    className="border px-4 py-3 rounded-md border-black/20 w-full text-base font-lato"
                    style={{
                      height: 48,
                      width: modalWidth * 0.5 - 6,
                      paddingVertical: Platform.OS === "ios" ? 12 : 8,
                      paddingTop: Platform.OS === "ios" ? 8 : 12,
                      lineHeight: Platform.OS === "ios" ? 20 : undefined,
                      borderColor: errors.fromAirport
                        ? "red"
                        : "rgba(0,0,0,0.2)",
                    }}
                    placeholder="From Airport"
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    placeholderTextColor="rgba(0,0,0,0.5)"
                  />
                  {errors.fromAirport && (
                    <Text style={{ color: "red", fontSize: 12 }}>
                      {errors.fromAirport.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="toAirport"
              rules={{
                required: "To airport is required",
                minLength: {
                  value: 3,
                  message: "Code must be at least 3 char",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    className="border px-4 py-3 rounded-md border-black/20 text-base font-lato"
                    style={{
                      height: 48,
                      width: modalWidth * 0.5 - 6,
                      paddingVertical: Platform.OS === "ios" ? 12 : 8,
                      paddingTop: Platform.OS === "ios" ? 8 : 12,
                      lineHeight: Platform.OS === "ios" ? 20 : undefined,
                      borderColor: errors.toAirport ? "red" : "rgba(0,0,0,0.2)",
                    }}
                    placeholder="To Airport"
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    placeholderTextColor="rgba(0,0,0,0.5)"
                  />
                  {errors.toAirport && (
                    <Text style={{ color: "red", fontSize: 12 }}>
                      {errors.toAirport.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
          <TouchableOpacity
            className="bg-primary py-3 rounded-lg w-full"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white font-semibold text-center text-base font-lato-bold">
              Add Flight
            </Text>
          </TouchableOpacity>
        </>
      )}
    </CustomModal>
  );
};

export default AddFlightModal;
