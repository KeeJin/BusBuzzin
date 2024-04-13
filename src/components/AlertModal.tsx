import React, { useState } from "react";
import { View, Modal, Text, TouchableWithoutFeedback } from "react-native";
import Toast from 'react-native-root-toast'
import { Picker } from "@react-native-picker/picker";
import ModalButton from "./ui/ModalButton";

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (time: number) => void;
  upperLimit: number;
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  onClose,
  onConfirm,
  upperLimit,
}) => {
  const [notificationTime, setNotificationTime] = useState(1);

  const handleConfirm = () => {
    if (notificationTime) {
      onConfirm(notificationTime);
      Toast.show('Alert time set!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        textColor: 'white'
      });
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
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{ backgroundColor: "rgba(156, 163, 175, 0.5)" }}
          className="h-full w-full flex-1 justify-center items-center px-5"
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="bg-slate-100 px-6 py-4 rounded-md justify-center">
              <Text className="text-center text-xl font-semibold">
                Set Notification Time
              </Text>
              <View className="border border-black rounded-full my-3">
                <Picker className="w-full"
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
                <ModalButton
                  title="Cancel"
                  onPress={onClose}
                  positive={false}
                />
                <ModalButton
                  title="Confirm"
                  onPress={handleConfirm}
                  positive={true}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AlertModal;
