import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface BookmarkButtonProps {
  isSaved: boolean;
  onPress: () => void;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ isSaved, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="bg-transparent">
      <MaterialIcons
        name={isSaved ? "bookmark-added" : "bookmark-border"}
        size={48}
        color="white"
      />
    </TouchableOpacity>
  );
};

export default BookmarkButton;
