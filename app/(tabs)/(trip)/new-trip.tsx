import { countries } from "@/assets/statics";
import { useUser } from "@/hooks/useUser";
import { formatTripForDatabase, insertTrip } from "@/lib/api/trip";
import { uploadImageToSupabase } from "@/lib/api/upload_image";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
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

const NewTrip = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
  });
  const [hasSelectedStart, setHasSelectedStart] = useState(false);
  const [hasSelectedEnd, setHasSelectedEnd] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [tripImageURI, setTripImageURI] = useState(undefined);

  const router = useRouter();
  const { user } = useUser();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
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
    if (!permissionResult.granted) return alert("Permission required!");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      const imageExtension =
        result.assets[0].fileName?.split(".").pop() || "jpg";

      // --- NEW CODE: Read the file from URI and convert it to base64 ---
      try {
        const base64Image = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Now pass the base64 string to your upload function
        const uploadResult = await uploadImageToSupabase(
          base64Image,
          imageExtension
        );

        if (uploadResult) {
          setTripImageURI(uploadResult);
        } else {
          alert("Failed to upload image.");
        }
      } catch (error) {
        console.error("Error converting URI to base64:", error);
        alert("An error occurred while preparing the image for upload.");
      }
    }
  };

  const onSubmit = (data) => {
    console.log("this is the image", tripImageURI);
    if (!user) return;
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

    try {
      insertTrip(tripData).then(() => {
        console.log("Trip created successfully!");
        router.push("/?refresh=" + Date.now());
      });
    } catch (error) {
      console.log("Error creating trip");
    }
  };

  return (
    <ScrollView className="bg-white flex-1 p-5">
      <Text className="text-3xl font-semibold mb-4">Create a new trip!</Text>

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
            height: 100,
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
              padding: tripImageURI ? 12 : 0,
              borderRadius: 8,
              backgroundColor: tripImageURI ? "#000000aa" : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: tripImageURI ? "white" : "rgba(0,0,0,0.5)",
                textAlign: "center",
              }}
            >
              {tripImageURI
                ? `Change image`
                : "📷 Add Trip Images\nTap to select photos"}
            </Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>

      <Controller
        control={control}
        name="tripName"
        render={({ field: { onChange, value } }) => (
          <View style={{ marginBottom: 12 }}>
            <TextInput
              placeholderTextColor={"rgba(0,0,0,0.5)"}
              className="border px-4 py-3 rounded-md border-black/20 w-full text-base font-lato"
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
              <Text style={{ color: "red" }}>{errors.tripName.message}</Text>
            )}
          </View>
        )}
      />

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
              className="border px-4 py-3 rounded-md border-black/20 w-full text-base font-lato"
              style={{
                height: 48,
                paddingVertical: Platform.OS === "ios" ? 12 : 8,
                paddingTop: Platform.OS === "ios" ? 8 : 12,
                lineHeight: Platform.OS === "ios" ? 20 : undefined,
              }}
            />
            {errors.destinationCity && (
              <Text style={{ color: "red" }}>
                {errors.destinationCity.message}
              </Text>
            )}
          </View>
        )}
      />

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
              className="border px-4 py-3 rounded-md border-black/20 w-full text-base font-lato"
              style={{
                height: 48,
                paddingVertical: Platform.OS === "ios" ? 12 : 8,
                paddingTop: Platform.OS === "ios" ? 8 : 12,
                lineHeight: Platform.OS === "ios" ? 20 : undefined,
              }}
            />
            {errors.passengers && (
              <Text style={{ color: "red" }}>{errors.passengers.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="selectedClass"
        render={({ field: { onChange, value } }) => (
          <View>
            <Dropdown
              style={{
                height: 50,
                backgroundColor: "white",
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
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
              <Text style={{ color: "red" }}>
                {errors.selectedClass.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="selectedItems"
        render={({ field: { onChange, value } }) => (
          <View
            style={{
              marginBottom: 12,
            }}
          >
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
              searchPlaceholder="Search countries... "
            />
            {errors.selectedItems && (
              <Text style={{ color: "red" }}>
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
                className="flex-1 px-4 py-3 text-base font-lato"
                style={{
                  height: 48,
                  paddingVertical: Platform.OS === "ios" ? 12 : 8,
                  paddingTop: Platform.OS === "ios" ? 8 : 12,
                  lineHeight: Platform.OS === "ios" ? 20 : undefined,
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
              <Text style={{ color: "red" }}>{errors.budget.message}</Text>
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
          marginTop: 12,
          height: 48,
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.2)",
          borderRadius: 8,
          paddingHorizontal: 14,
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

      {/* Date Pickers */}
      {renderDatePicker(
        showStartPicker,
        startDate,
        onStartDateChange,
        new Date()
      )}
      {renderDatePicker(showEndPicker, endDate, onEndDateChange, startDate)}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        className="bg-primary py-4 mt-4 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">
          Create new trip
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default NewTrip;
