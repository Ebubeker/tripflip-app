// import { Text } from "react-native";
// import CustomModal from "../ui/Modal";

// interface EditTripModelProps {
//   show: boolean;
//   setShow: (value: boolean) => void;
// }

// const EditTripModel = ({ show, setShow }: EditTripModelProps) => {
//   return (
//     <CustomModal show={show} setShow={setShow} title="Edit Trip">
//       <Text className="text-center text-lg font-semibold">
//         This feature is not implemented yet.
//       </Text>
//       <Text className="text-center text-sm text-gray-500 mt-2">
//         Please check back later!
//       </Text>
//     </CustomModal>
//   );
// };

// export default EditTripModel;


import { countries } from "@/assets/statics";
import { useUser } from "@/hooks/useUser";
import { Trip, formatTripForDatabase } from "@/lib/api/trip";
import { uploadImageToSupabase } from "@/lib/api/upload_image";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import * as yup from "yup";
import CustomModal from "../ui/Modal";

const schema = yup.object().shape({
  tripName: yup
    .string()
    .required("Trip name is required")
    .min(3, "Trip name must be at least 3 characters"),
  destinationCity: yup
    .string()
    .required("Destination city is required")
    .min(3, "Destination city must be at least 3 characters"),
  passengers: yup
    .number()
    .typeError("Passengers must be a number")
    .required("Passengers is required")
    .min(1, "At least 1 passenger"),
  selectedClass: yup.string().required("Select a class"),
  selectedItems: yup.array().min(1, "Select at least one country"),
  budget: yup
    .number()
    .transform((value, originalValue) => originalValue === "" ? undefined : value)
    .nullable()
    .min(0, "Budget cannot be negative"),
});

interface EditTripModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  trip?: Trip;
  onTripUpdated?: (updatedTripData: Omit<Trip, "id" | "created_at" | "updated_at">) => void;
}

const EditTripModal = ({ show, setShow, trip, onTripUpdated }: EditTripModalProps) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [hasSelectedStart, setHasSelectedStart] = useState(false);
  const [hasSelectedEnd, setHasSelectedEnd] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [tripImageURI, setTripImageURI] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tripName: "",
      destinationCity: "",
      passengers: 1,
      selectedClass: "economy",
      selectedItems: [],
      budget: undefined,
    },
  });

  // Initialize form with trip data when modal opens
  useEffect(() => {
    if (show && trip) {
      setValue("tripName", trip.name);
      setValue("destinationCity", trip.destination_city);
      setValue("passengers", trip.passengers);
      setValue("selectedClass", trip.selected_class || "economy");
      setValue("selectedItems", trip.countries || []);
      setValue("budget", trip.budget || undefined);

      const start = new Date(trip.start_date);
      const end = new Date(trip.end_date);
      setStartDate(start);
      setEndDate(end);
      setHasSelectedStart(true);
      setHasSelectedEnd(true);
      setTripImageURI(trip.selected_images || undefined);
    }
  }, [show, trip, setValue]);

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      reset();
      setHasSelectedStart(false);
      setHasSelectedEnd(false);
      setTripImageURI(undefined);
    }
  }, [show, reset]);

  const classOptions = [
    { label: "Economy", value: "economy" },
    { label: "Premium Economy", value: "premium_economy" },
    { label: "Business", value: "business" },
    { label: "First Class", value: "first_class" },
  ];

  const onStartDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      setShowStartPicker(false);
    }
    if (event.type === "set" && selectedDate) {
      setStartDate(selectedDate);
      setHasSelectedStart(true);
      if (Platform.OS === "ios") {
        setShowStartPicker(false);
      }
    }
  };

  const onEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowEndPicker(false);
    }
    if (event.type === "set" && selectedDate) {
      setEndDate(selectedDate);
      setHasSelectedEnd(true);
      if (Platform.OS === "ios") {
        setShowEndPicker(false);
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          onRequestClose={() => {
            setShowStartPicker(false);
            setShowEndPicker(false);
          }}
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
                <TouchableOpacity
                  onPress={() => {
                    setShowStartPicker(false);
                    setShowEndPicker(false);
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#007AFF" }}>Cancel</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: "600" }}>
                  Select Date
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowStartPicker(false);
                    setShowEndPicker(false);
                  }}
                >
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
        onChange={onChange}
        minimumDate={minimumDate}
      />
    );
  };

  const handleImageSelection = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return Alert.alert("Error", "Permission required!");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      const imageExtension =
        result.assets[0].fileName?.split(".").pop() || "jpg";

      try {
        const base64Image = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const uploadResult = await uploadImageToSupabase(
          base64Image,
          imageExtension
        );

        if (uploadResult) {
          setTripImageURI(uploadResult);
        } else {
          Alert.alert("Error", "Failed to upload image.");
        }
      } catch (error) {
        console.error("Error converting URI to base64:", error);
        Alert.alert("Error", "An error occurred while preparing the image for upload.");
      }
    }
  };

  const onSubmit = async (data: any) => {
    if (!user || !trip) return;

    setLoading(true);

    try {
      const tripData = formatTripForDatabase(
        data.tripName,
        data.destinationCity,
        data.selectedItems,
        startDate,
        endDate,
        user.id,
        parseInt(data.passengers),
        data.selectedClass,
        tripImageURI || "",
        data.budget ? parseFloat(data.budget) : undefined,
        "USD"
      );

      onTripUpdated?.(tripData);
      // setShow(false);
    } catch (error) {
      console.error("Error updating trip:", error);
      Alert.alert("Error", "Failed to update trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal show={show} setShow={setShow} title="Edit Trip">
      <ScrollView style={{ maxHeight: 600 }} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{ uri: tripImageURI || "" }}
          borderRadius={8}
          style={{
            opacity: 0.8,
            borderRadius: 8,
            marginBottom: 16,
          }}
          resizeMode="cover"
        >
          <TouchableOpacity
            onPress={handleImageSelection}
            style={{
              height: 80,
              borderWidth: 2,
              borderColor: "rgba(0,0,0,0.2)",
              borderStyle: "dashed",
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.02)",
            }}
          >
            <View
              style={{
                padding: tripImageURI ? 8 : 0,
                borderRadius: 8,
                backgroundColor: tripImageURI ? "#000000aa" : "transparent",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: tripImageURI ? "white" : "rgba(0,0,0,0.5)",
                  textAlign: "center",
                }}
              >
                {tripImageURI ? `Change image` : "📷 Add Trip Image"}
              </Text>
            </View>
          </TouchableOpacity>
        </ImageBackground>

        {/* Trip Name */}
        <Controller
          control={control}
          name="tripName"
          render={({ field: { onChange, value } }) => (
            <View style={{ marginBottom: 12 }}>
              <TextInput
                placeholderTextColor={"rgba(0,0,0,0.5)"}
                className="border px-4 py-3 rounded-md border-black/20 w-full text-base"
                style={{
                  height: 48,
                  paddingVertical: Platform.OS === "ios" ? 12 : 8,
                  paddingTop: Platform.OS === "ios" ? 8 : 12,
                  lineHeight: Platform.OS === "ios" ? 20 : undefined,
                }}
                placeholder="Trip Name"
                value={value}
                onChangeText={onChange}
              />
              {errors.tripName && (
                <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                  {errors.tripName.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* Destination City */}
        <Controller
          control={control}
          name="destinationCity"
          render={({ field: { onChange, value } }) => (
            <View style={{ marginBottom: 12 }}>
              <TextInput
                placeholderTextColor={"rgba(0,0,0,0.5)"}
                placeholder="Destination City"
                value={value}
                onChangeText={onChange}
                className="border px-4 py-3 rounded-md border-black/20 w-full text-base"
                style={{
                  height: 48,
                  paddingVertical: Platform.OS === "ios" ? 12 : 8,
                  paddingTop: Platform.OS === "ios" ? 8 : 12,
                  lineHeight: Platform.OS === "ios" ? 20 : undefined,
                }}
              />
              {errors.destinationCity && (
                <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                  {errors.destinationCity.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* Passengers */}
        <Controller
          control={control}
          name="passengers"
          render={({ field: { onChange, value } }) => (
            <View style={{ marginBottom: 12 }}>
              <TextInput
                placeholder="Passengers"
                keyboardType="numeric"
                value={value.toString()}
                onChangeText={onChange}
                placeholderTextColor={"rgba(0,0,0,0.5)"}
                className="border px-4 py-3 rounded-md border-black/20 w-full text-base"
                style={{
                  height: 48,
                  paddingVertical: Platform.OS === "ios" ? 12 : 8,
                  paddingTop: Platform.OS === "ios" ? 8 : 12,
                  lineHeight: Platform.OS === "ios" ? 20 : undefined,
                }}
              />
              {errors.passengers && (
                <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                  {errors.passengers.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* Class Selection */}
        <Controller
          control={control}
          name="selectedClass"
          render={({ field: { onChange, value } }) => (
            <View style={{ marginBottom: 12 }}>
              <Dropdown
                style={{
                  height: 50,
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.2)",
                }}
                placeholderStyle={{
                  fontSize: 14,
                  color: "rgba(49, 49, 49, 0.5)",
                }}
                selectedTextStyle={{
                  fontSize: 14,
                }}
                inputSearchStyle={{
                  height: 40,
                  fontSize: 14,
                }}
                iconStyle={{
                  width: 20,
                  height: 20,
                }}
                data={classOptions}
                value={value}
                onChange={(item) => onChange(item.value)}
                labelField="label"
                valueField="value"
                placeholder="Select Class"
              />
              {errors.selectedClass && (
                <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                  {errors.selectedClass.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* Country Selection */}
        <Controller
          control={control}
          name="selectedItems"
          render={({ field: { onChange, value } }) => (
            <View style={{ marginBottom: 12 }}>
              <Dropdown
                style={{
                  height: 50,
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.2)",
                }}
                placeholderStyle={{
                  fontSize: 14,
                  color: "rgba(49, 49, 49, 0.5)",
                }}
                selectedTextStyle={{
                  fontSize: 14,
                }}
                inputSearchStyle={{
                  height: 40,
                  fontSize: 14,
                }}
                iconStyle={{
                  width: 20,
                  height: 20,
                }}
                data={countries}
                value={value ? value[0] : null}
                onChange={(item) => onChange([item.value])}
                labelField="label"
                valueField="value"
                placeholder="Select Country"
                search
                searchPlaceholder="Search countries..."
              />
              {errors.selectedItems && (
                <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                  {errors.selectedItems.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* Budget Input */}
        <Controller
          control={control}
          name="budget"
          render={({ field: { onChange, value } }) => (
            <View style={{ marginBottom: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.2)",
                  borderRadius: 8,
                  backgroundColor: "white",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#FF8CBE",
                    paddingHorizontal: 14,
                    height: 48,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: 14,
                    }}
                  >
                    USD
                  </Text>
                </View>
                <TextInput
                  placeholder="Trip Budget (optional)"
                  keyboardType="numeric"
                  value={value ? value.toString() : ""}
                  onChangeText={onChange}
                  placeholderTextColor={"rgba(0,0,0,0.5)"}
                  style={{
                    flex: 1,
                    paddingHorizontal: 14,
                    height: 48,
                    fontSize: 14,
                  }}
                />
              </View>
              <Text
                style={{
                  fontSize: 11,
                  color: "rgba(0,0,0,0.5)",
                  marginTop: 4,
                  marginLeft: 4,
                }}
              >
                Set a budget to track your trip expenses
              </Text>
              {errors.budget && (
                <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                  {errors.budget.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* Start Date */}
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          style={{
            height: 48,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
            borderRadius: 8,
            paddingHorizontal: 14,
            justifyContent: "center",
            backgroundColor: "white",
            marginBottom: 12,
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

        {/* End Date */}
        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          style={{
            height: 48,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
            borderRadius: 8,
            paddingHorizontal: 14,
            justifyContent: "center",
            backgroundColor: "white",
            marginBottom: 20,
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

        {/* Date Pickers */}
        {renderDatePicker(
          showStartPicker,
          startDate,
          onStartDateChange,
          new Date()
        )}
        {renderDatePicker(showEndPicker, endDate, onEndDateChange, startDate)}

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
          <TouchableOpacity
            onPress={() => setShow(false)}
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.1)",
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "rgba(0,0,0,0.7)" }}>
              Cancel
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: loading ? "rgba(0,0,0,0.3)" : "#007AFF",
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
              {loading ? "Updating..." : "Update Trip"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </CustomModal>
  );
};

export default EditTripModal;