import { updateUser } from "@/lib/api/user";
import { User } from "@/type/user";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Animated,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import CustomModal from "../ui/Modal";

interface EditProfileModalProps {
  visible: boolean;
  onClose: (val: boolean) => void;
  user: User;
  onSave: (updatedUser: User) => void;
  refetch: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  user,
  onSave,
  refetch
}) => {
  const slideAnim = new Animated.Value(0);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    },
    mode: "onChange",
  });

  const watchedValues = watch();

  useEffect(() => {
    if (visible) {
      reset({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      });

      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, user, reset]);

  const onSubmit = async (data: FormData): Promise<void> => {
    updateUser(user.id, data).then(()=> {
      refetch()
      onClose(false);
    })
  };

  const renderInput = (
    name: keyof FormData,
    label: string,
    placeholder: string,
    keyboardType: "default" | "email-address" = "default",
    autoCapitalize: "none" | "sentences" | "words" | "characters" = "words"
  ) => (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: "#1f2937",
          marginBottom: 8,
        }}
        className="font-lato"
      >
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        rules={{
          required: `${label} is required`,
          minLength: {
            value: name === "email" ? 5 : 2,
            message: `${label} must be at least ${
              name === "email" ? 5 : 2
            } characters`,
          },
          ...(name === "email" && {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          }),
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            editable={!isSubmitting}
            placeholderTextColor={"rgba(0,0,0,0.5)"}
            className="border px-4 py-3 rounded-md border-black/20 w-full text-base font-lato"
            style={{
              height: 48,
              paddingVertical: Platform.OS === "ios" ? 12 : 8,
              paddingTop: Platform.OS === "ios" ? 8 : 12,
              lineHeight: Platform.OS === "ios" ? 20 : undefined,
            }}
          />
        )}
      />
      {errors[name] && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 6,
          }}
        >
          <Ionicons name="alert-circle" size={16} color="#ef4444" />
          <Text
            className="font-lato"
            style={{
              fontSize: 14,
              color: "#ef4444",
              marginLeft: 6,
            }}
          >
            {errors[name]?.message}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <CustomModal show={visible} setShow={onClose} title="Edit Profile Info">
      <View>
        {renderInput(
          "firstName",
          "First Name",
          "Enter your first name",
          "default",
          "words"
        )}
        {renderInput(
          "lastName",
          "Last Name",
          "Enter your last name",
          "default",
          "words"
        )}
        {/* {renderInput(
          "email",
          "Email Address",
          "Enter your email address",
          "email-address",
          "none"
        )} */}
      </View>
      <View className="flex-row mt-4">
        <View className="w-1/2">
          <TouchableOpacity
            onPress={() => onClose(false)}
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
            onPress={handleSubmit(onSubmit)}
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

export default EditProfileModal;
