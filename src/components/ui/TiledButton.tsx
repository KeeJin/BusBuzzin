import React from "react";
import { Pressable, Text, ImageSourcePropType, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface TiledButtonProps {
  icon: ImageSourcePropType | string; // Accepts either ImageSourcePropType or string (Ionicons name)
  text: string;
  onPress: () => void;
}

const TiledButton: React.FC<TiledButtonProps> = ({ icon, text, onPress }) => {
    const renderIcon = () => {
        if (typeof icon === 'string') {
          return <Ionicons name={icon as any} size={40} color="black" />;
        } else {
          return <Image source={icon} className='w-6 h-6 mr-2' />;
        }
    };
    return (
    <Pressable
      className="flex flex-column items-center justify-center w-36 h-36 m-2 p-2 bg-slate-400 rounded-2xl active:bg-slate-500"
      onPress={onPress}
    >
      {renderIcon()}
      <Text className="text-center mx-2 w-20">{text}</Text>
    </Pressable>
  );
};

export default TiledButton;
