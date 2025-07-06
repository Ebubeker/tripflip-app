import CustomModal from "@/components/ui/Modal";
import { insertPlace } from "@/lib/api/trip";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
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

interface AddPlaceModalProps {
  tripId: string;
  show: boolean;
  setShow: (show: boolean) => void;
  refetch: () => void;
}

type PlaceType = 
  | 'attraction'
  | 'restaurant'
  | 'museum'
  | 'park'
  | 'beach'
  | 'shopping'
  | 'nightlife'
  | 'activity'
  | 'other';

interface PlaceFormData {
  name: string;
  type: PlaceType;
  address: string;
  visitDate?: Date;
  cost?: string;
}

const placeTypeOptions: { label: string; value: PlaceType }[] = [
  { label: 'Attraction', value: 'attraction' },
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Museum', value: 'museum' },
  { label: 'Park', value: 'park' },
  { label: 'Beach', value: 'beach' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Nightlife', value: 'nightlife' },
  { label: 'Activity', value: 'activity' },
  { label: 'Other', value: 'other' },
];

const AddPlaceModal = ({
  tripId,
  show,
  setShow,
  refetch,
}: AddPlaceModalProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasSelectedDate, setHasSelectedDate] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PlaceFormData>({
    defaultValues: {
      name: "",
      type: "attraction",
      address: "",
      visitDate: new Date(),
      cost: "",
    },
  });

  const visitDate = watch("visitDate");
  const modalWidth = Dimensions.get("window").width - 80;

  const onSubmit = (data: PlaceFormData) => {
    const formattedData = {
      name: data.name,
      type: data.type,
      address: data.address,
      visitDate: hasSelectedDate ? data.visitDate : undefined,
      cost: data.cost,
    };
    
    insertPlace(
      tripId,
      formattedData.name,
      formattedData.type,
      formattedData.address,
      formattedData.visitDate,
      formattedData.cost
    )
      .then((data) => {
        console.log(data);
        refetch();
      })
      .catch((error) => {
        console.error("Error inserting place:", error);
      });
    reset();
    setHasSelectedDate(false);
    setShow(false);
  };

  const onDateChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === "android") {
        setShowDatePicker(false);
      }
      if (event.type === "set" && selectedDate) {
        setValue("visitDate", selectedDate);
        setHasSelectedDate(true);
        if (Platform.OS === "ios") {
          setShowDatePicker(false);
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

  const closeDatePicker = () => {
    setShowDatePicker(false);
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
          onRequestClose={closeDatePicker}
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
                <TouchableOpacity onPress={closeDatePicker}>
                  <Text style={{ fontSize: 16, color: "#007AFF" }}>Cancel</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: "600" }}>
                  Select Date
                </Text>
                <TouchableOpacity onPress={closeDatePicker}>
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
    <CustomModal show={show} setShow={setShow} title="Add a place to visit">
      <View className="mb-4">
        <Controller
          control={control}
          name="name"
          rules={{
            required: "Name is required",
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="border px-4 py-3 rounded-md border-black/20 w-full text-base font-lato"
              style={{
                height: 48,
                paddingVertical: Platform.OS === "ios" ? 12 : 8,
                paddingTop: Platform.OS === "ios" ? 8 : 12,
                lineHeight: Platform.OS === "ios" ? 20 : undefined,
                borderColor: errors.name ? "red" : "rgba(0,0,0,0.2)",
              }}
              placeholder="Place name"
              onChangeText={onChange}
              value={value}
              autoCapitalize="words"
              autoCorrect={false}
              placeholderTextColor="rgba(0,0,0,0.5)"
            />
          )}
        />
        {errors.name && (
          <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
            {errors.name.message}
          </Text>
        )}
      </View>

      <View className="mb-4">
        <Controller
          control={control}
          name="type"
          rules={{
            required: "Type is required",
          }}
          render={({ field: { onChange, value } }) => (
            <View
              style={{
                borderWidth: 1,
                borderColor: errors.type ? "red" : "rgba(0,0,0,0.2)",
                borderRadius: 4,
                height: 48,
                justifyContent: "center",
              }}
            >
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={{
                  height: 48,
                  color: "black",
                }}
              >
                {placeTypeOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.type && (
          <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
            {errors.type.message}
          </Text>
        )}
      </View>

      <View className="mb-4">
        <Controller
          control={control}
          name="address"
          rules={{
            required: "Address is required",
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="border px-4 py-3 rounded-md border-black/20 w-full text-base font-lato"
              style={{
                height: 48,
                paddingVertical: Platform.OS === "ios" ? 12 : 8,
                paddingTop: Platform.OS === "ios" ? 8 : 12,
                lineHeight: Platform.OS === "ios" ? 20 : undefined,
                borderColor: errors.address ? "red" : "rgba(0,0,0,0.2)",
              }}
              placeholder="Address"
              onChangeText={onChange}
              value={value}
              autoCapitalize="words"
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

      <View className="mb-4">
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
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
              color: hasSelectedDate ? "black" : "rgba(0,0,0,0.5)",
            }}
          >
            {hasSelectedDate
              ? `Visit Date: ${formatDate(visitDate!)}`
              : "Select Visit Date (optional)"}
          </Text>
        </TouchableOpacity>

        {renderDatePicker(
          showDatePicker,
          visitDate!,
          onDateChange,
          new Date()
        )}
      </View>

      <Controller
        control={control}
        name="cost"
        rules={{
          pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: "Please enter a valid cost",
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
                borderColor: errors.cost ? "red" : "rgba(0,0,0,0.2)",
              }}
              keyboardType="numeric"
              placeholder="Cost (optional)"
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="rgba(0,0,0,0.5)"
            />
            {errors.cost && (
              <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                {errors.cost.message}
              </Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        className="bg-primary py-3 rounded-lg w-full"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white font-semibold text-center text-base font-lato-bold">
          Add Place
        </Text>
      </TouchableOpacity>
    </CustomModal>
  );
};

export default AddPlaceModal;