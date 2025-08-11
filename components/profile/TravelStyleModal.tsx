import { updateUser } from "@/lib/api/user";
import { User } from "@/type/user";
import { useEffect, useState } from "react";
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import CustomModal from "../ui/Modal";

interface TravelStyleModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  user: User;
}

const TravelStyleModal = ({ show, setShow, user }: TravelStyleModalProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [travelStyles, setTravelStyles] = useState<string[]>([]);

  useEffect(() => {
    if (user?.travel_style) {
      const styles = user.travel_style.split(', ')
      setTravelStyles(styles);
      setInputValue(styles.join(', '));
    } else {
      setTravelStyles([]);
      setInputValue("");
    }
  }, [user]);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    const styles = text.split(',').map(style => style.trim()).filter(style => style.length > 0);
    setTravelStyles(styles);
  };

  const removeStyle = (indexToRemove: number) => {
    const newStyles = travelStyles.filter((_, index) => index !== indexToRemove);
    setTravelStyles(newStyles);
    setInputValue(newStyles.join(', '));
  };

  const handleSubmit = () => {
    if (user) {
      updateUser(user.id, {
        travel_style: travelStyles.join(', '),
      })
        .then(() => {
          setShow(false);
        })
        .catch((error) => {
          console.error("Error updating user travel style:", error);
        });
    }
  };

  return (
    <CustomModal show={show} setShow={setShow} title="Configure Travel Style">
      <View style={{ marginBottom: 12, marginTop: 16 }}>
        <TextInput
          placeholderTextColor={"rgba(0,0,0,0.5)"}
          placeholder="adventure, chill, extreme"
          value={inputValue}
          onChangeText={handleInputChange}
          className="border px-4 py-3 rounded-md border-black/20 w-full text-base font-lato"
          style={{
            height: 48,
            paddingVertical: Platform.OS === "ios" ? 12 : 8,
            paddingTop: Platform.OS === "ios" ? 8 : 12,
            lineHeight: Platform.OS === "ios" ? 20 : undefined,
          }}
          multiline={false}
        />
      </View>
      
      {travelStyles.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 16 }}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {travelStyles.map((style, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => removeStyle(index)}
                style={{
                  backgroundColor: '#f0f0f0',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, marginRight: 4 }}>{style}</Text>
                <Text style={{ fontSize: 16, color: '#666' }}>×</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-primary py-4 mt-4 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">
          Save Travel Style
        </Text>
      </TouchableOpacity>
    </CustomModal>
  );
};

export default TravelStyleModal;