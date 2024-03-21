import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import { Text, TextInput, View, ScrollView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Button from "./components/ui/Button";
import FetchInfoByBusStopCode from "./services/api/FetchInfoByBusStopCode";

export default function App() {
  const [count, setCount] = useState<number>(0);
  const [shouldGrab, setShouldGrab] = useState<boolean>(false);
  const [busStopNumber, setBusStopNumber] = useState<string>("");
  const [rawData, setRawData] = useState<string>("NULL");
  const [busArrivalData, setBusArrivalData] = useState<
    Map<string, Array<string>>[]
  >([]);

  useEffect(() => {
    const calculateMinutesToArrival = (arrivalTimeString: string): number => {
      // Parse the arrival time string into a Date object
      const arrivalTime = new Date(arrivalTimeString);
      // console.log("Arrival Time: " + arrivalTime.getTime());

      // Get the current time
      const currentTime = new Date();
      // console.log("Current Time: " + currentTime.getTime());

      // Calculate the time difference in milliseconds
      const timeDifferenceMs = arrivalTime.getTime() - currentTime.getTime();
      // console.log("Time Difference: " + timeDifferenceMs);

      // Convert the time difference to minutes
      const minutesToArrival = Math.round(timeDifferenceMs / (1000 * 60));
      // console.log("Minutes to Arrival: " + minutesToArrival);

      return minutesToArrival;
    };
    if (shouldGrab) {
      FetchInfoByBusStopCode(busStopNumber)
        .then((data) => {
          if (data["Services"] !== undefined) {
            let arrivalData: Map<string, Array<string>>[] = [];
            data["Services"].forEach((service: any) => {
              const serviceNo = service["ServiceNo"];
              const nextBusArrival = calculateMinutesToArrival(
                service["NextBus"]["EstimatedArrival"]
              );
              const nextBus2Arrival = calculateMinutesToArrival(
                service["NextBus2"]["EstimatedArrival"]
              );
              const nextBus3Arrival = calculateMinutesToArrival(
                service["NextBus3"]["EstimatedArrival"]
              );
              arrivalData.push(
                new Map([
                  [
                    serviceNo,
                    [
                      nextBusArrival.toString(),
                      nextBus2Arrival.toString(),
                      nextBus3Arrival.toString(),
                    ],
                  ],
                ])
              );
              // console.log("Service No: " + JSON.stringify(service["ServiceNo"]));
              // console.log("Next Buses (min): " +  calculateMinutesToArrival(service["NextBus"]["EstimatedArrival"]));
              // console.log(", " +  calculateMinutesToArrival(service["NextBus2"]["EstimatedArrival"]));
              // console.log(", " +  calculateMinutesToArrival(service["NextBus3"]["EstimatedArrival"]));
            });
            setBusArrivalData(arrivalData);
          }
          // console.log(JSON.stringify(data, null, 2));
          setRawData(JSON.stringify(data, null, 2));
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      setShouldGrab(false);
    }
  }, [shouldGrab]);

  interface BusArrival {
    busNumber: string;
    arrivalTimes: string[];
  }

  // const Item = (title: string, values: string[]) => (
  //   <View className="m-1 rounded-xl bg-blue-50">
  //     <Text className="px-2">{title}</Text>
  //     <Text className="px-2">
  //       {values[0]} min, {values[1]} min, {values[2]} min
  //     </Text>
  //   </View>
  // );

  const renderItem = ({ item }: { item: Map<string, Array<string>> }) => (
    <View style={{ marginVertical: 10 }}>
      {Array.from(item.entries()).map(([key, values], index) => (
        <View className="m-1 py-2 px-1 rounded-xl bg-blue-50" key={index}>
          <Text className="px-2 text-xl p-1">Bus {key}</Text>
          <Text className="px-2">
            {values[0]} min, {values[1]} min, {values[2]} min
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View className="bg-black w-full h-full items-center">
      <Text className="text-3xl text-white text-center mt-5">Bus Buzz!!</Text>
      {/* <View className=" bg-blue-50 w-4/5 h-5/6 items-center mt-5"> */}
      <View className="w-3/4 h-4/5 mt-3 bg-transparent items-center">
        <Text className="text-xl text-white text-center my-1">
          Quick Search
        </Text>
        {/* <Button
            title="Click here"
            onPress={() => {
              console.log("Button pressed.");
              setCount(count + 1);
            }}
          /> */}
        {/* <Text className="text-md text-white text-center mt-3">
            Count: {count}
          </Text> */}
        <TextInput
          className="w-3/4 bg-gray-400 my-3 text-white text-center rounded-xl"
          onChangeText={setBusStopNumber}
          value={busStopNumber}
          placeholder="Search with bus stop code..."
          autoFocus={false}
        ></TextInput>
        <Button
          title="Grab data"
          onPress={() => {
            setShouldGrab(true);
          }}
        />
        <ScrollView className="w-full h-1/5 rounded-xl bg-gray-400 mt-7 mb-3 p-2">
          <Text className="text-md text-gray-800">{rawData}</Text>
        </ScrollView>
        <Button className="my-3"
          title="Clear data"
          onPress={() => {
            setRawData("NULL");
          }}
        />
        <FlatList
          className="w-full h-1/2 bg-gray-400 mt-7 p-2 rounded-xl"
          data={busArrivalData}
          renderItem={renderItem}
          keyExtractor={(_, index: number) => index.toString()}
        />
      </View>
      {/* </View> */}
      <StatusBar style="inverted" translucent={false} hidden={false} />
    </View>
  );
}

registerRootComponent(App);
