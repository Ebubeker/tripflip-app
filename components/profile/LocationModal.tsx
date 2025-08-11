import { countries } from "@/assets/statics";
import { updateUser } from "@/lib/api/user";
import { User } from "@/type/user";
import { useEffect, useState } from "react";
import { Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import CustomModal from "../ui/Modal";

interface LocationModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  user: User;
}

const LocationModal = ({ show, setShow, user }: LocationModalProps) => {
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  useEffect(() => {
    if (user?.city && user?.country) {
      setCity(user.city || "");
      setCountry(JSON.parse(user.country)[0] || "");
    } else {
      setCity("");
      setCountry("");
    }
  }, [user])
  
  const handleSubmit = () => {
    if(user){
      updateUser(user.id, {
        city: city,
        country: [country],
      })
        .then(() => {
          setShow(false);
        })
        .catch((error) => {
          console.error("Error updating user location:", error);
      })
    }
  }
  
  return (
    <CustomModal show={show} setShow={setShow} title="Configure Location">
      <View style={{ marginBottom: 12, marginTop: 16 }}>
        <TextInput
          placeholderTextColor={"rgba(0,0,0,0.5)"}
          placeholder="Current City"
          value={city}
          onChangeText={(text) => setCity(text)}
          className="border px-4 py-3 rounded-md border-black/20 w-full text-base font-lato"
          style={{
            height: 48,
            paddingVertical: Platform.OS === "ios" ? 12 : 8,
            paddingTop: Platform.OS === "ios" ? 8 : 12,
            lineHeight: Platform.OS === "ios" ? 20 : undefined,
          }}
        />
      </View>
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
          value={country}
          onChange={(item) => setCountry(item.value)}
          labelField="label"
          valueField="value"
          placeholder="Select Country"
          search
          searchPlaceholder="Search countries... "
        />
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-primary py-4 mt-4 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">
          Save
        </Text>
      </TouchableOpacity>
    </CustomModal>
  );
};

export default LocationModal;
