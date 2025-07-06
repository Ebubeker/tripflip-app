import { countries } from "@/assets/statics";
import { useUser } from "@/hooks/useUser";
import { formatTripForDatabase, insertTrip } from "@/lib/api/trip";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

const NewTrip = () => {
  const [tripName, setTripName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [hasSelectedStart, setHasSelectedStart] = useState(false);
  const [hasSelectedEnd, setHasSelectedEnd] = useState(false);

  const router = useRouter();

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

  const { user, loading } = useUser();

  const createNewTrip = () => {
    if (user) {
      const tripdata = formatTripForDatabase(
        tripName,
        selectedItems,
        startDate,
        endDate,
        user.id
      );

      try {
        insertTrip(tripdata).then(()=>{
          console.log("Trip created successfully!");
          router.push("/?refresh=" + Date.now());
        })
      } catch (error) {
        console.log("Error creating trip");
      }

    }
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

    // Android
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

  return (
    <View className="bg-white flex-1 p-5">
      <Text className="text-3xl font-lato-bold font-semibold">
        Create a new trip!
      </Text>
      <View className="gap-4 mt-8">
        <TextInput
          className="border px-4 py-3 rounded-md border-black/20 w-full mb-4 text-base font-lato"
          style={{
            height: 48,
            paddingVertical: Platform.OS === "ios" ? 12 : 8,
            paddingTop: Platform.OS === "ios" ? 8 : 12,
            lineHeight: Platform.OS === "ios" ? 20 : undefined,
          }}
          placeholder="Trip Name"
          onChangeText={setTripName}
          value={tripName}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="rgba(0,0,0,0.5)"
        />

        <MultiSelect
          style={{
            height: 50,
            backgroundColor: "white",
            borderRadius: 8,
            padding: 12,
            elevation: 2,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
          }}
          placeholderStyle={{
            fontSize: 13,
            color: "rgba(0,0,0,0.5)",
          }}
          selectedTextStyle={{
            fontSize: 14,
          }}
          inputSearchStyle={{
            height: 40,
            fontSize: 16,
          }}
          iconStyle={{
            width: 20,
            height: 20,
          }}
          data={countries}
          labelField="label"
          valueField="value"
          placeholder="Select Countries"
          searchPlaceholder="Search countries..."
          value={selectedItems}
          search
          onChange={(item) => {
            setSelectedItems(item);
          }}
          selectedStyle={{
            borderRadius: 12,
            backgroundColor: "#ff8cbe33",
            marginRight: 8,
            marginBottom: 8,
          }}
        />

        {/* Start Date */}
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          style={{
            height: 48,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
            borderRadius: 8,
            paddingHorizontal: 16,
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          <Text
            style={{
              fontSize: 16,
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
            paddingHorizontal: 16,
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          <Text
            style={{
              fontSize: 16,
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
          className="bg-primary py-4 mt-4 rounded-lg w-full"
          onPress={createNewTrip}
        >
          <Text className="text-white font-semibold text-center text-base font-lato-bold">
            Create new trip
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewTrip;
