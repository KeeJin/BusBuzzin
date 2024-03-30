import React from "react";
import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

interface ButtonProps extends TouchableOpacityProps {
  onPress?: () => void;
  title: string;
}

const SimpleButton: React.FC<ButtonProps> = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className="bg-blue-400 px-4 w-fit h-10 rounded-full justify-center items-center"
  >
    <MaterialIcons name="search" size={20} color="black" />
  </TouchableOpacity>
);

export default SimpleButton;
