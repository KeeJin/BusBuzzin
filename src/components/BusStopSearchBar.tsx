import React, { useState } from "react";
import { View, Text, TextInput, FlatList, Pressable } from "react-native";
import SimpleButton from "./ui/SimpleButton";
import useBusStopDb from "../hooks/UseBusStopDb";

interface BusStopSearchBarProps {
  title: string;
  userInput: string;
  onTextChange: (text: string) => void;
  onConfirm: () => void;
  onSuggestionAccept: (suggestion: string) => void;
}

const BusStopSearchBar: React.FC<BusStopSearchBarProps> = ({
  title,
  userInput,
  onTextChange,
  onConfirm,
  onSuggestionAccept,
}) => {
  const { busStopArray } = useBusStopDb();
  const [filteredBusStopArray, setFilteredBusStopArray] = useState<string[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const filterBusStops = (text: string) => {
    const filteredArray = busStopArray?.filter((busStop) =>
      busStop.toLowerCase().includes(text.toLowerCase())
    );
    if (filteredArray) {
      setFilteredBusStopArray(filteredArray);
    } else {
      setFilteredBusStopArray([]);
    }
  };

  const renderSuggestions = ({ item }: { item: string }) => {
    return (
      <Pressable
        className="px-2 py-3 bg-gray-200 border-b border-black active:opacity-75"
        
        onPress={() => {
          onSuggestionAccept(item);
          filterBusStops(item);
          setShowSuggestions(false);
        }}
      >
        <Text numberOfLines={1} className="text-black text-base">
          {item}
        </Text>
      </Pressable>
    );
  };
  return (
    <View className="items-center h-full">
      <Text className="text-lg text-white text-center">{title}</Text>
      <View className="flex-row h-full w-full mt-3 mb-1 px-3 justify-between ">
        <View className="h-full">
          <TextInput
            className="w-48 bg-gray-400 px-3 text-sm text-white text-center rounded-full focus:border-2 focus:border-slate-200"
            value={userInput}
            onChangeText={(text) => {
              onTextChange(text);
              filterBusStops(text);
            }}
            placeholder="Search for bus stop..."
            autoFocus={false}
            inputMode="text"
            onFocus={() => {setShowSuggestions(true);}}
          />
          {showSuggestions && userInput.length >= 5 && (
            <View className="w-52 h-40 mt-8 absolute rounded-xl z-10 bg-gray-300 ">
              <FlatList
                className="p-2 h-full overflow-y-scroll"
                data={filteredBusStopArray}
                renderItem={renderSuggestions}
                keyExtractor={(item) => item}
              />
            </View>
          )}
        </View>
        <SimpleButton title="Go" onPress={onConfirm} />
      </View>
    </View>
  );
};

export default BusStopSearchBar;
