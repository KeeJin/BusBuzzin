import React from "react";
import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  onPress?: () => void;
  title: string;
}

const SimpleButton: React.FC<ButtonProps> = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className="bg-blue-400 px-7 w-fit h-8 rounded-2xl justify-center items-center"
  >
    <Text className="text-md text-white text-center">{title}</Text>
  </TouchableOpacity>
);

export default SimpleButton;
