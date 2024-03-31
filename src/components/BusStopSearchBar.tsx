import React, { useState } from "react";
import { View, Text, TextInput, FlatList, Pressable } from "react-native";
import SearchButton from "./ui/SearchButton";
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
        className="px-2 py-1 bg-gray-200 border-b border-black active:bg-gray-400"
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
    <View className="items-center h-full w-full">
      {title.length !== 0 && (
        <View className="flex-row left-5">
          <Text className="text-xl text-white mt-3 mb-1 w-full font-semibold">
            {title}
          </Text>
        </View>
      )}
      <View className="flex-row h-full w-full mt-3 mb-1 px-3 justify-between ">
        <View style={{ width: "77%" }} className="h-full mr-2">
          <TextInput
            className="bg-gray-400 px-3 py-1 text-sm text-white text-left rounded-full focus:border-2 focus:border-slate-300"
            value={userInput}
            onChangeText={(text) => {
              onTextChange(text);
              filterBusStops(text);
            }}
            placeholder="Search for bus stop..."
            autoFocus={false}
            inputMode="text"
            onFocus={() => {
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setShowSuggestions(false);
            }}
            onSubmitEditing={onConfirm}
            selectTextOnFocus={true}
          />
          <Text
            style={{ fontSize: 13, lineHeight: 24 }}
            className="text-white text-left mx-2 font-light italic"
          >
            Try "Bishan" or "53239".
          </Text>
          {showSuggestions && userInput.length >= 5 && (
            <View className="h-20 mt-9 w-full flex-1 absolute rounded-xl z-20 bg-gray-300 ">
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
        <View className="h-full pr-3">
          <SearchButton onPress={onConfirm} />
        </View>
      </View>
    </View>
  );
};

export default BusStopSearchBar;
