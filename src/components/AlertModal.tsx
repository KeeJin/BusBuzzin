import React, { useState } from 'react';
import { View, Modal, Text, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (time: number) => void;
  upperLimit: number;
}

const AlertModal: React.FC<AlertModalProps> = ({ visible, onClose, onConfirm, upperLimit }) => {
  const [notificationTime, setNotificationTime] = useState(1);

  const handleConfirm = () => {
    if (notificationTime) {
      onConfirm(notificationTime);
      onClose();
    }
  };

  const pickerItems = Array.from({ length: upperLimit }, (_, i) => (
    <Picker.Item key={i + 1} label={`${i + 1} minutes`} value={(i + 1).toString()} />
  ));

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className='flex-1 justify-center items-center bg-gray-400'>
        <View className='bg-white p-4 rounded-md'>
          <Text>Set Notification Time (minutes)</Text>
          <Picker
            selectedValue={String(notificationTime)}
            onValueChange={(itemValue: string) => setNotificationTime(Number(itemValue))}
            className="w-full"
          >
            <Picker.Item label="Minutes in advance" value="" />
            {pickerItems}
          </Picker>
          <Button title="Confirm" onPress={handleConfirm} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;
