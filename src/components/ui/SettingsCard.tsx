import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface SettingsCardProps {
  title: string;
  onPress: () => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={70}
      className="bg-slate-400 active:bg-slate-500 p-3 mx-2 my-2 rounded-md"
    >
      <Text className="text-black text-lg font-semibold">{title}</Text>
    </TouchableOpacity>
  );
};

export default SettingsCard;
