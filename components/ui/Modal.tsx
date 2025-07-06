import { XIcon } from "lucide-react-native";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  title?: string;
  children: React.ReactNode;
}

const CustomModal = ({ show, setShow, title, children }: ModalProps) => {
  return (
    <Modal transparent={true} animationType="fade" visible={show}>
      <View
        className="justify-center items-center w-full h-full"
        style={{ backgroundColor: "#00000080", paddingHorizontal: 20 }}
      >
        <View className="bg-white w-full p-5 rounded-2xl relative">
          {title ? (
            <Text
              style={{ fontSize: 18, marginBottom: 16 }}
              className="font-lato-bold"
            >
              {title}
            </Text>
          ) : null}
          {children}
          <TouchableOpacity onPress={() => setShow(false)} style={{position: 'absolute', right: 10, top: 10}}>
            <XIcon size={15} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
