import React, { useState } from "react";
import { View, Text, Keyboard, TouchableWithoutFeedback } from "react-native";
import useBusStopDb from "../hooks/UseBusStopDb";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import TiledButton from "../components/ui/TiledButton";
import BusStopSearchBar from "../components/BusStopSearchBar";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [busstopId, setBusstopId] = useState<string>("");
  const { busStopMap, busStopArray } = useBusStopDb();

  const handleSearchConfirm = (id: string) => {
    setBusstopId(id);
    if (id === "") {
      return;
    }
    let shouldSearch = false;
    if (busStopMap && busStopMap.has(id)) {
      shouldSearch = true;
    }

    if (id.length >= 5 && busStopMap && busStopMap.has(id.slice(-6, -1))) {
      shouldSearch = true;
      id = id.slice(-6, -1);
    }

    if (shouldSearch) {
      navigation.navigate("BusStopDashboard", {
        id: id,
      });
    } else {
      alert("Invalid bus stop entry!");
    }
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="bg-slate-800 w-full h-full items-center justify-center">
        <Text className="text-3xl text-white text-center font-bold">
          BusBuzzin
        </Text>
        <Text className="text-lg text-white text-center font-light mb-3">
          Your friendly bus arrival app
        </Text>
        <View
          style={{ height: "18%" }}
          className="w-3/4 mt-5 pt-1 pb-14 z-10 bg-slate-600 shadow-2xl shadow-white border-2 border-slate-500 items-center rounded-2xl"
        >
          <BusStopSearchBar
            title="Quick Search"
            userInput={busstopId}
            onTextChange={setBusstopId}
            onSuggestionAccept={handleSearchConfirm}
            onConfirm={() => {
              handleSearchConfirm(busstopId);
            }}
          />
          <Text className="text-white text-center text-sm mx-8 font-light">
            {busStopArray?.length} bus stops across Singapore, right at your
            fingertips.
          </Text>
        </View>
        <View className="flex flex-row flex-wrap justify-center mt-10">
          <TiledButton
            icon="bookmarks"
            text="Saved Bus Stops"
            onPress={() => {
              navigation.navigate("SavedBusStops");
            }}
          />
          <TiledButton icon="map" text="Search Near Me" onPress={() => {}} />
          <TiledButton
            icon="notifications-active"
            text="Bus Alerts"
            onPress={() => {
              navigation.navigate("SavedBusAlertsScreen");
            }}
          />
          <TiledButton
            icon="app-settings-alt"
            text="Settings"
            onPress={() => {
              navigation.navigate("Settings");
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;
