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
    className="bg-gray-500 px-2 w-fit rounded-full justify-center items-center"
  >
    <Text className="">{title}</Text>
  </TouchableOpacity>
);

export default SimpleButton;
