import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Button from "../components/ui/Button";
import useBusStopMap from "../hooks/UseBusStopMap";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
  route: RouteProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [busstopId, setBusstopId] = useState<string>("");
  const [shouldGrab, setShouldGrab] = useState<boolean>(false);
  const busStopMap = useBusStopMap();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="bg-slate-800 w-full h-full items-center">
        <Text className="text-3xl text-white text-center my-5">Bus Buzz!!</Text>

        <View className="w-3/4 h-fit pt-3 pb-5 bg-slate-600 shadow-2xl shadow-white border-2 border-slate-500 items-center rounded-2xl">
          <Text className="text-lg text-white text-center">Quick Search</Text>
          <TextInput
            className="w-56 bg-gray-400 my-3 px-3 text-sm text-white text-center rounded-full focus:border-2 focus:border-slate-200"
            onChangeText={setBusstopId}
            value={busstopId}
            placeholder="Search for bus stop code..."
            autoFocus={false}
            inputMode="numeric"
          ></TextInput>
          <Button
            title="Search"
            onPress={() => {
              if (busstopId === "") {
                return;
              }
              if (busStopMap && !busStopMap.has(busstopId)) {
                alert("Invalid bus stop code");
                return;
              }
              setShouldGrab(true);
              Keyboard.dismiss();
              navigation.navigate("BusStopDashboard", { id: busstopId });
            }}
          />
        </View>
        <StatusBar style="inverted" translucent={false} hidden={false} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;
