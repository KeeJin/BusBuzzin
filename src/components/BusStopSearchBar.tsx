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
        className="px-2 py-2 bg-gray-200 border-b border-black active:bg-gray-400"
        
        onPress={() => {
          onSuggestionAccept(item);
          filterBusStops(item);
          setShowSuggestions(false);
        }}
      >
        <Text numberOfLines={1} className="text-black text-sm">
          {item}
        </Text>
      </Pressable>
    );
  };
  return (
    <View className="items-center h-full">
      <Text className="text-base text-white text-center m-1">{title}</Text>
      <View className="flex-row h-full w-full mt-3 mb-1 px-5 justify-between ">
        <View className="h-full">
          <TextInput
            className="w-44 bg-gray-400 px-3 text-sm text-white text-center rounded-full focus:border-2 focus:border-slate-200"
            value={userInput}
            onChangeText={(text) => {
              onTextChange(text);
              filterBusStops(text);
            }}
            placeholder="Search for bus stop..."
            autoFocus={false}
            inputMode="text"
            onFocus={() => {setShowSuggestions(true);}}
            onBlur={() => {setShowSuggestions(false);}}
            onSubmitEditing={onConfirm}
            selectTextOnFocus={true}
          />
          {showSuggestions && userInput.length >= 5 && (
            <View className="w-44 h-24 mt-8 flex-1 absolute rounded-xl z-20 bg-gray-300 ">
              <FlatList
                className="p-2 h-full flex-1 overflow-y-scroll"
                data={filteredBusStopArray}
                renderItem={renderSuggestions}
                keyExtractor={(item) => item}
                keyboardShouldPersistTaps="always"
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
