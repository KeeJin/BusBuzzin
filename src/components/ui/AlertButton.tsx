import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface AlertButtonProps {
  isAlertEnabled: boolean;
  onPress: () => void;
}

const AlertButton: React.FC<AlertButtonProps> = ({ isAlertEnabled, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="bg-transparent justify-center m-2">
      <MaterialIcons
        name={isAlertEnabled ? "notifications" : "notifications-none"}
        size={40}
        color="black"
      />
    </TouchableOpacity>
  );
};

export default AlertButton;
