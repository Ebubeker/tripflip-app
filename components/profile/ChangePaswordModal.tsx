import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import CustomModal from "../ui/Modal";

// Move the component definition outside of the main component
interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordInput = React.memo(({ 
  placeholder, 
  showPassword, 
  setShowPassword,
  control,
  name,
  rules,
  error
}: {
  placeholder: string;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  control: any;
  name: keyof PasswordFormData;
  rules: any;
  error?: any;
}) => (
  <View style={{ marginBottom: 4 }}>
    <View style={{ position: 'relative', marginBottom: 4 }}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholderTextColor={"rgba(0,0,0,0.5)"}
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={!showPassword}
            className="border px-4 py-3 rounded-md border-black/20 w-full text-base font-lato"
            style={{
              height: 48,
              paddingVertical: Platform.OS === "ios" ? 12 : 8,
              paddingTop: Platform.OS === "ios" ? 8 : 12,
              paddingRight: 50,
              lineHeight: Platform.OS === "ios" ? 20 : undefined,
              borderColor: error ? '#ef4444' : 'rgba(0,0,0,0.2)',
            }}
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
          />
        )}
      />
      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
        style={{
          position: 'absolute',
          right: 12,
          top: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          // width: 24,
          // height: 24,
          alignSelf: 'center',
        }}
      >
        <Ionicons
          name={showPassword ? "eye-off" : "eye"}
          size={20}
          color="rgba(0,0,0,0.5)"
        />
      </TouchableOpacity>
    </View>
    {error && (
      <Text style={{ 
        fontSize: 12, 
        color: '#ef4444', 
        marginBottom: 8,
        marginLeft: 4
      }}>
        {error.message}
      </Text>
    )}
  </View>
));

interface ChangePasswordModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

const ChangePasswordModal = ({ show, setShow }: ChangePasswordModalProps) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    mode: "onBlur"
  });

  const newPassword = watch("newPassword");
  const currentPassword = watch("currentPassword");

  const resetForm = () => {
    reset();
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const onSubmit = async (data: PasswordFormData) => {
    setLoading(true);

    try {
      // Get current user
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user?.email) {
        Alert.alert("Error", "Unable to verify user information");
        setLoading(false);
        return;
      }

      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.user.email,
        password: data.currentPassword,
      });

      if (signInError) {
        Alert.alert("Error", "Current password is incorrect");
        setLoading(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (updateError) {
        Alert.alert("Error", updateError.message || "Failed to update password");
        setLoading(false);
        return;
      }

      Alert.alert(
        "Success", 
        "Password updated successfully. You will be logged out for security reasons.",
        [
          {
            text: "OK",
            onPress: async () => {
              resetForm();
              setShow(false);
              
              // Log out the user for security
              await supabase.auth.signOut();
              router.replace("/login");
            }
          }
        ]
      );

    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    setShow(false);
  };

  return (
    <CustomModal show={show} setShow={handleClose} title="Change Password">
      <View style={{ marginTop: 16 }}>
        <PasswordInput
          placeholder="Current Password"
          showPassword={showCurrentPassword}
          setShowPassword={setShowCurrentPassword}
          control={control}
          name="currentPassword"
          rules={{
            required: "Current password is required"
          }}
          error={errors.currentPassword}
        />

        <PasswordInput
          placeholder="New Password"
          showPassword={showNewPassword}
          setShowPassword={setShowNewPassword}
          control={control}
          name="newPassword"
          rules={{
            required: "New password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long"
            },
            validate: (value: string) => 
              value !== currentPassword || "New password must be different from current password"
          }}
          error={errors.newPassword}
        />

        <PasswordInput
          placeholder="Confirm New Password"
          showPassword={showConfirmPassword}
          setShowPassword={setShowConfirmPassword}
          control={control}
          name="confirmPassword"
          rules={{
            required: "Please confirm your new password",
            validate: (value: string) => 
              value === newPassword || "Passwords do not match"
          }}
          error={errors.confirmPassword}
        />

        <Text style={{ 
          fontSize: 12, 
          color: 'rgba(0,0,0,0.6)', 
          marginBottom: 16,
          marginTop: 4
        }}>
          Password must be at least 6 characters long
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
        className="bg-primary py-4 mt-4 rounded-lg"
        style={{
          opacity: loading ? 0.7 : 1,
        }}
      >
        <Text className="text-white text-center font-semibold">
          {loading ? "Updating..." : "Change Password"}
        </Text>
      </TouchableOpacity>
    </CustomModal>
  );
};

export default ChangePasswordModal;