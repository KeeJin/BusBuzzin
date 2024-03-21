import React from "react";
import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  onPress?: () => void;
  title: string;
}

const Button: React.FC<ButtonProps> = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className="bg-blue-400 py-2 px-3 w-1/2 rounded-2xl"
  >
    <Text className="text-lg text-white text-center">{title}</Text>
  </TouchableOpacity>
);

export default Button;
