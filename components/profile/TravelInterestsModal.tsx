import { updateUser } from "@/lib/api/user";
import { User } from "@/type/user";
import { useEffect, useState } from "react";
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import CustomModal from "../ui/Modal";

interface TravelInterestsModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  user: User;
}

const TravelInterestsModal = ({ show, setShow, user }: TravelInterestsModalProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [travelInterests, setTravelInterests] = useState<string[]>([]);

  useEffect(() => {
    if (user?.travel_interests) {
      const interests = user.travel_interests;
      setTravelInterests(interests);
      setInputValue(interests.join(', '));
    } else {
      setTravelInterests([]);
      setInputValue("");
    }
  }, [user]);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    const interests = text.split(',').map(interest => interest.trim()).filter(interest => interest.length > 0);
    setTravelInterests(interests);
  };

  const removeInterest = (indexToRemove: number) => {
    const newInterests = travelInterests.filter((_, index) => index !== indexToRemove);
    setTravelInterests(newInterests);
    setInputValue(newInterests.join(', '));
  };

  const handleSubmit = () => {
    if (user) {
      updateUser(user.id, {
        travel_interests: travelInterests,
      })
        .then(() => {
          setShow(false);
        })
        .catch((error) => {
          console.error("Error updating user travel interests:", error);
        });
    }
  };

  return (
    <CustomModal show={show} setShow={setShow} title="Configure Travel Interests">
      <View style={{ marginBottom: 12, marginTop: 16 }}>
        <TextInput
          placeholderTextColor={"rgba(0,0,0,0.5)"}
          placeholder="museums, food, nightlife, culture"
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
      
      {travelInterests.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 16 }}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {travelInterests.map((interest, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => removeInterest(index)}
                style={{
                  backgroundColor: '#e3f2fd',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 14, marginRight: 4, color: '#1976d2' }}>{interest}</Text>
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
          Save Travel Interests
        </Text>
      </TouchableOpacity>
    </CustomModal>
  );
};

export default TravelInterestsModal;