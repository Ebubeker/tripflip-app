import CustomModal from "@/components/ui/Modal";
import { insertStay } from "@/lib/api/trip";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useCallback, useState } from "react";
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

interface AddFlightModalProps {
  tripId: string;
  show: boolean;
  setShow: (show: boolean) => void;
  refetch: () => void;
}

interface StayFormData {
  hotelName: string;
  price: string;
  fromDate: Date;
  toDate: Date;
  address?: string;
}

const AddStayModal = ({
  tripId,
  show,
  setShow,
  refetch,
}: AddFlightModalProps) => {
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
  } = useForm<StayFormData>({
    defaultValues: {
      hotelName: "",
      price: "",
      fromDate: new Date(),
      toDate: new Date(),
      address: "",
    },
  });

  const startDate = watch("fromDate");
  const endDate = watch("toDate");

  const modalWidth = Dimensions.get("window").width - 80;

  const onSubmit = (data: StayFormData) => {
    const formattedData = {
      hotelName: data.hotelName,
      price: data.price,
      fromDate: data.fromDate,
      toDate: data.toDate,
      address: data.address,
    };
    insertStay(
      tripId,
      formattedData.hotelName,
      formattedData.price,
      formattedData.fromDate,
      formattedData.toDate,
      formattedData.address
    )
      .then((data) => {
        refetch();
        console.log(data);
      })
      .catch((error) => {
        console.error("Error inserting flight:", error);
      });
    reset();
    setHasSelectedStart(false);
    setHasSelectedEnd(false);
    setShow(false);
  };

  const onStartDateChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === "android") {
        setShowStartPicker(false);
      }
      if (event.type === "set" && selectedDate) {
        setValue("fromDate", selectedDate);
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
        setValue("toDate", selectedDate);
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
    <CustomModal show={show} setShow={setShow} title="Add a stay">
      <View className="mb-4">
        <Controller
          control={control}
          name="hotelName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="border px-4 py-3 rounded-md border-black/20 w-full text-base font-lato"
              style={{
                height: 48,
                paddingVertical: Platform.OS === "ios" ? 12 : 8,
                paddingTop: Platform.OS === "ios" ? 8 : 12,
                lineHeight: Platform.OS === "ios" ? 20 : undefined,
                borderColor: errors.hotelName ? "red" : "rgba(0,0,0,0.2)",
              }}
              placeholder="Name"
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="rgba(0,0,0,0.5)"
            />
          )}
        />
        {errors.hotelName && (
          <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
            {errors.hotelName.message}
          </Text>
        )}
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
              placeholder="Price per night"
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="rgba(0,0,0,0.5)"
            />
            {errors.price && (
              <Text style={{ color: "red", fontSize: 12, marginBottom: 16 }}>
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
        {renderDatePicker(showEndPicker, endDate, onEndDateChange, startDate)}
      </View>

      <View className="mb-4">
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="border px-4 py-3 rounded-md border-black/20 w-full text-base font-lato"
              style={{
                height: 48,
                paddingVertical: Platform.OS === "ios" ? 12 : 8,
                paddingTop: Platform.OS === "ios" ? 8 : 12,
                lineHeight: Platform.OS === "ios" ? 20 : undefined,
                borderColor: errors.hotelName ? "red" : "rgba(0,0,0,0.2)",
              }}
              placeholder="Address (optional)"
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="rgba(0,0,0,0.5)"
            />
          )}
        />
        {errors.address && (
          <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
            {errors.address.message}
          </Text>
        )}
      </View>

      <TouchableOpacity
        className="bg-primary py-3 rounded-lg w-full"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white font-semibold text-center text-base font-lato-bold">
          Add Stay
        </Text>
      </TouchableOpacity>
    </CustomModal>
  );
};

export default AddStayModal;
