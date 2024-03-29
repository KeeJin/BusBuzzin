import React from "react";
import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";

interface ModalButtonProps extends TouchableOpacityProps {
  onPress?: () => void;
  positive?: boolean;
  title: string;
}

const ModalButton: React.FC<ModalButtonProps> = ({
  onPress,
  positive,
  title,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    className={
      positive
        ? " bg-lime-500 py-3 m-1 w-24 rounded-full"
        : "bg-red-400 py-3 m-1 w-24 rounded-full"
    }
  >
    <Text className="text-md text-white text-center font-medium">{title}</Text>
  </TouchableOpacity>
);

export default ModalButton;
