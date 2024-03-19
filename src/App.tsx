import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import {
  Text, 
  TextInput,
  View,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Button from "./components/ui/Button";
import FetchInfoByBusStopCode from "./services/api/FetchInfoByBusStopCode";

export default function App() {
  const [count, setCount] = useState<number>(0);
  const [shouldGrab, setShouldGrab] = useState<boolean>(false);
  const [busStopNumber, setBusStopNumber] = useState<string>("");
  const [rawData, setRawData] = useState<string>("NULL");
  
  useEffect(() => {
    if (shouldGrab) {
      FetchInfoByBusStopCode(busStopNumber)
        .then((data) => {
          console.log(JSON.stringify(data, null, 2));
          setRawData(JSON.stringify(data, null, 2));
        })
        .catch((error) => {
          console.error("Error:", error);
        });
        setShouldGrab(false);
    }
  }, [shouldGrab]);
  
  return (
    <View className="bg-red-100 w-full h-full items-center">
      <Text className="text-2xl text-black text-center my-2">Bus Buzz</Text>
      <View className=" bg-blue-50 w-4/5 h-5/6 items-center mt-5">
        <View className="w-1/2 h-3/4 mt-5 bg-transparent">
          <Text className="text-2xl text-black text-center my-1">Test</Text>
          <Button
            title="Click here"
            onPress={() => {
              console.log("Button pressed.");
              setCount(count + 1);
            }}
          />
          <Text className="text-md text-black text-center mt-3">
            Count: {count}
          </Text>
          <TextInput className='w-full bg-gray-400 my-2 text-white' onChangeText={setBusStopNumber} value={busStopNumber}></TextInput>
          <Button title="Grab data"
            onPress={() => {
              setShouldGrab(true);
            }}
          />
          <ScrollView className="w-full h-full bg-gray-200 my-2">
            <Text className="text-md text-black">{rawData}</Text>
          </ScrollView>
          <Button title="Clear data"
            onPress={() => {
              setRawData("NULL");
            }}
          />
        </View>
      </View>
      <StatusBar style="inverted" translucent={false} hidden={false} />
    </View>
  );
}

registerRootComponent(App);
