import React from "react";

import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import ModalButton from "./ui/ModalButton";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View
          style={{ backgroundColor: "rgba(156, 163, 175, 0.5)" }}
          className="flex-1 justify-center items-center"
        >
          <View className="bg-white px-5 py-4 rounded-md">
            <Text className="text-lg font-bold mb-2">{title}</Text>
            <Text numberOfLines={2} className="mb-4">
              {message}
            </Text>
            <View className="flex-row justify-between px-1">
              <ModalButton title="No" onPress={onCancel} positive={false} />
              <ModalButton title="Yes" onPress={onConfirm} positive={true} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ConfirmationModal;
