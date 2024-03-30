import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, Vibration } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import useSavedBusStops from "../hooks/UseSavedBusStops";
import useBusStopDb from "../hooks/UseBusStopDb";
import { BusStopGeneralInfo } from "../types";

type SavedBusStopsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SavedBusStops">;
};

const SavedBusStopsScreen: React.FC<SavedBusStopsScreenProps> = ({
  navigation,
}) => {
  const savedBusStops = useSavedBusStops();
  const { busStopMap } = useBusStopDb();
  const [busStopNameMapping, setBusStopNameMapping] = useState<
    BusStopGeneralInfo[]
  >([]);

  useEffect(() => {
    const constructBusStopNameMapping = () => {
      const busStopGeneralInfos = [] as BusStopGeneralInfo[];
      if (busStopMap && savedBusStops) {
        savedBusStops.forEach((busStopCode) => {
          if (busStopMap && busStopMap.has(busStopCode)) {
            const busStopName = busStopMap.get(busStopCode)?.Description;
            busStopGeneralInfos.push({
              busStopCode: busStopCode,
              description: busStopName ? busStopName : "Unknown",
            });
          }
        });
      }
      setBusStopNameMapping(busStopGeneralInfos);
    };
    constructBusStopNameMapping();
  }, [savedBusStops, busStopMap]);

  const renderSavedBusStops = ({ item }: { item: BusStopGeneralInfo }) => {
    return (
      <View className="mb-4">
        {item && (
          <Pressable
            className="bg-slate-400 active:opacity-75 rounded-xl m-1 p-2"
            onPress={() => {
              navigation.replace("BusStopDashboard", { id: item.busStopCode });
            }}
            onLongPress={() => {
              Vibration.vibrate(20);
            }}
          >
            <Text className="text-black text-xl text-center">
              {item.description}
            </Text>
            <Text className="text-black text-sm text-center">
              ({item.busStopCode})
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  const renderSavedBusStopList = () => {
    if (busStopNameMapping) {
      if (busStopNameMapping.length !== 0) {
        return (
          <View className="w-full h-3/4 bg-transparent rounded-xl">
            <FlatList
              className="w-full h-full mt-3 bg-slate-600 rounded-xl p-3 overflow-y-auto"
              data={busStopNameMapping}
              renderItem={renderSavedBusStops}
              keyExtractor={(item) => item.busStopCode}
            />
          </View>
        );
      } else {
        return (
          <View className="w-full h-auto mt-3 bg-slate-400 rounded-xl p-3 pb-5 items-center flex">
            <Text className="text-black text-center text-xl mt-3">
              No saved bus stops.
            </Text>
          </View>
        );
      }
    }
    return (
      <View className="w-full h-auto mt-3 bg-slate-400 rounded-xl p-3 pb-5 items-center flex">
        <Text className="text-black text-center text-xl mt-3">
          Loading saved bus stops...
        </Text>
      </View>
    );
  };

  return (
    <View className="bg-slate-800 h-full px-6 justify-center">
      <Text className="text-white text-3xl text-left pl-2">
        Saved Bus Stops
      </Text>
      {renderSavedBusStopList()}
    </View>
  );
};

export default SavedBusStopsScreen;
