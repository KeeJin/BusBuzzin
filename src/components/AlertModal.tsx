import React, { useState } from "react";
import { View, Modal, Text, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import ModalButton from "./ui/ModalButton";

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (time: number) => void;
  onRequestClose: () => void;
  upperLimit: number;
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  onClose,
  onConfirm,
  onRequestClose,
  upperLimit,
}) => {
  const [notificationTime, setNotificationTime] = useState(1);

  const handleConfirm = () => {
    if (notificationTime) {
      onConfirm(notificationTime);
      onClose();
    }
  };

  const pickerItems = Array.from({ length: upperLimit }, (_, i) => (
    <Picker.Item
      style={{ fontSize: 20 }}
      key={i + 1}
      label={`${i + 1} min`}
      value={(i + 1).toString()}
    />
  ));

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onRequestClose}
    >
      <View
        style={{ backgroundColor: "rgba(156, 163, 175, 0.5)" }}
        className="h-full w-full flex-1 justify-center items-center px-5"
      >
        <View className="bg-slate-100 px-6 py-4 rounded-md justify-center">
          <Text className="text-center text-xl font-semibold">
            Set Notification Time
          </Text>
          <View className="border border-black rounded-full my-2">
            <Picker
              selectedValue={String(notificationTime)}
              onValueChange={(itemValue: string) =>
                setNotificationTime(Number(itemValue))
              }
              mode="dialog"
              prompt="Select Time"
            >
              {pickerItems}
            </Picker>
          </View>
          <View className="flex-row justify-between">
            <ModalButton title="Cancel" onPress={onClose} positive={false} />
            <ModalButton
              title="Confirm"
              onPress={handleConfirm}
              positive={true}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;
