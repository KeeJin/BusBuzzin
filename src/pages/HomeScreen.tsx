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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="bg-slate-800 w-full h-full items-center justify-center">
        <Text className="text-3xl text-white text-center font-bold">
          BusBuzzin
        </Text>
        <Text className="text-lg text-white text-center font-light mb-3">
          Your friendly bus arrival app.
        </Text>
        <View className="w-3/4 h-1/6 mt-5 pt-3 pb-3 z-10 bg-slate-600 shadow-2xl shadow-white border-2 border-slate-500 items-center rounded-2xl">
          <BusStopSearchBar
            title="Quick Search"
            userInput={busstopId}
            onTextChange={setBusstopId}
            onSuggestionAccept={(suggestion) => {
              setBusstopId(suggestion);
            }}
            onConfirm={() => {
              if (busstopId === "") {
                return;
              }
              if (busStopArray && !busStopArray.includes(busstopId)) {
                alert("Invalid bus stop code");
                return;
              }
              Keyboard.dismiss();
              navigation.navigate("BusStopDashboard", {
                id: busstopId.slice(-6, -1),
              });
            }}
          />
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
