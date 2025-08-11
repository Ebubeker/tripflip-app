import { uploadImageToSupabase } from "@/lib/api/upload_image";
import { updateUser } from "@/lib/api/user";
import { User } from "@/type/user";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import CustomModal from "../ui/Modal";

interface ChangeImageProps {
  show: boolean;
  setShow: (val: boolean) => void;
  refetch: () => void;
  user: User;
}

const ChangeImage = ({ show, setShow, refetch, user }: ChangeImageProps) => {
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined
  );

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
          setProfileImage(uploadResult);
        } else {
          alert("Failed to upload image.");
        }
      } catch (error) {
        console.error("Error converting URI to base64:", error);
        alert("An error occurred while preparing the image for upload.");
      }
    }
  };

  const handleSubmit = () => {
    if (!profileImage) {
      return Alert.alert("No Image selected", "Please select an image first.");
    }
    
    updateUser(user.id, {
      avatarUrl: profileImage,
    }).then(() => {
      refetch();
      setShow(false);
    });
  };

  return (
    <CustomModal show={show} setShow={setShow} title="Change profile image">
      <View>
        <ImageBackground
          source={
            user.avatar_url || profileImage
              ? { uri: profileImage ? profileImage : user.avatar_url }
              : require("../../assets/images/traveler.png")
          }
          borderRadius={5500}
          style={{
            height: 150,
            width: 150,
            opacity: 0.8,
            marginHorizontal: "auto",
            borderRadius: 5500,
            marginBottom: 16,
          }}
          resizeMode="cover"
        >
          <TouchableOpacity
            onPress={handleImageSelection}
            style={{
              height: 150,
              width: 150,
              marginHorizontal: "auto",
              borderWidth: 2,
              borderColor: "rgba(0,0,0,0.2)",
              borderStyle: "dashed",
              borderRadius: 5500,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.02)",
            }}
          >
            <View
              style={{
                padding: 8,
                borderRadius: 12,
                backgroundColor: "#000000aa",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "white",
                  textAlign: "center",
                }}
              >
                {"📷 Profile"}
              </Text>
            </View>
          </TouchableOpacity>
        </ImageBackground>
      </View>
      <View className="flex-row mt-4">
        <View className="w-1/2">
          <TouchableOpacity
            onPress={() => setShow(false)}
            style={{
              marginRight: 4,
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: "#D1D5DB",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text
              className="font-lato"
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-1/2">
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-primary border border-primary py-4 rounded-lg"
            style={{
              marginLeft: 4,
            }}
          >
            <Text className="text-white text-center font-semibold">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomModal>
  );
};

export default ChangeImage;
