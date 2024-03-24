import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import SimpleButton from "../components/ui/SimpleButton";
import useBusStopMap from "../hooks/UseBusStopMap";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import TiledButton from "../components/ui/TiledButton";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [busstopId, setBusstopId] = useState<string>("");
  const busStopMap = useBusStopMap();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="bg-slate-800 w-full h-full items-center justify-center">
        <Text className="text-3xl text-white text-center font-bold">BusBuzzin</Text>
        <Text className="text-lg text-white text-center font-light mb-3">Your friendly bus arrival app.</Text>
        <View className="w-3/4 h-fit mt-5 pt-3 pb-5 bg-slate-600 shadow-2xl shadow-white border-2 border-slate-500 items-center rounded-2xl">
          <Text className="text-lg text-white text-center">Quick Search</Text>
          <TextInput
            className="w-56 bg-gray-400 my-3 px-3 text-sm text-white text-center rounded-full focus:border-2 focus:border-slate-200"
            onChangeText={setBusstopId}
            value={busstopId}
            placeholder="Search for bus stop code..."
            autoFocus={false}
            inputMode="numeric"
          ></TextInput>
          <SimpleButton
            title="Search"
            onPress={() => {
              if (busstopId === "") {
                return;
              }
              if (busStopMap && !busStopMap.has(busstopId)) {
                alert("Invalid bus stop code");
                return;
              }
              Keyboard.dismiss();
              navigation.navigate("BusStopDashboard", { id: busstopId });
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
            onPress={() => {}}
          />
          <TiledButton icon="app-settings-alt" text="Settings" onPress={() => {
            navigation.navigate("Settings");
          }} />
        </View>
        <StatusBar style="auto" translucent={false} hidden={false} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;
