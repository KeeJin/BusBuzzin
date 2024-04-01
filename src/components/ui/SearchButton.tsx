import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

interface SearchButtonProps extends TouchableOpacityProps {
  onPress?: () => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className="bg-blue-400 px-4 w-fit h-10 rounded-full justify-center items-center"
  >
    <MaterialIcons name="search" size={20} color="black" />
  </TouchableOpacity>
);

export default SearchButton;
