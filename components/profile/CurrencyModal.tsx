import { updateUser } from "@/lib/api/user";
import { User } from "@/type/user";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import CustomModal from "../ui/Modal";

const currencies = [
  {
    label: "USD",
    value: "USD",
  },
  {
    label: "EUR",
    value: "EUR",
  },
  {
    label: "GBP",
    value: "GBP",
  },
  {
    label: "CAD",
    value: "CAD",
  },
];

interface CurrencyModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  user: User;
}

const CurrencyModal = ({ show, setShow, user }: CurrencyModalProps) => {
  const [currency, setCurrency] = useState<string>("");

  useEffect(() => {
    if (user?.preferred_currency) {
      setCurrency(user.preferred_currency || "");
    } else {
      setCurrency("");
    }
  }, [user]);

  const handleSubmit = () => {
    if (user) {
      updateUser(user.id, {
        preferred_currency: currency,
      })
        .then(() => {
          setShow(false);
        })
        .catch((error) => {
          console.error("Error updating user currency:", error);
        });
    }
  };

  return (
    <CustomModal show={show} setShow={setShow} title="Configure Currency">
      <View
        style={{
          marginBottom: 12,
          marginTop: 16,
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
          data={currencies}
          value={currency}
          onChange={(item) => setCurrency(item.value)}
          labelField="label"
          valueField="value"
          placeholder="Select Currency"
          search
          searchPlaceholder="Search currencies..."
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-primary py-4 mt-4 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">
          Save Currency
        </Text>
      </TouchableOpacity>
    </CustomModal>
  );
};

export default CurrencyModal;
