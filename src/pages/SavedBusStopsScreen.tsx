import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Vibration } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SwipeListView } from "react-native-swipe-list-view";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import useBusStopDb from "../hooks/UseBusStopDb";
import { BusStopGeneralInfo } from "../types";

type SavedBusStopsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SavedBusStops">;
};

const SavedBusStopsScreen: React.FC<SavedBusStopsScreenProps> = ({
  navigation,
}) => {
  const { busStopMap } = useBusStopDb();
  const [busStopNameMapping, setBusStopNameMapping] = useState<
    BusStopGeneralInfo[]
  >([]);
  const [triggerRefresh, setTriggerRefresh] = useState<boolean>(true);
  const [savedBusStops, setSavedBusStops] = useState<string[]>();

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
  }, [savedBusStops]);

  useEffect(() => {
    const fetchSavedBusStops = async () => {
      if (triggerRefresh) {
        // console.log("triggerRefresh is true");
        try {
          const savedBusStopsRaw = await AsyncStorage.getItem("savedBusStops");
          if (savedBusStopsRaw) {
            setSavedBusStops(JSON.parse(savedBusStopsRaw));
            // console.log("Updated saved bus stops: ", savedBusStops);
          }
        } catch (error) {
          console.error("Error fetching saved bus stops:", error);
        }
        setTriggerRefresh(false);
      }
    };

    fetchSavedBusStops();
  }, [triggerRefresh]);

  const renderSavedBusStops = ({ item }: { item: BusStopGeneralInfo }) => {
    // console.log("Rendering saved bus stop: ", item);
    return (
      <View className="mb-4">
        {item && (
          <Pressable
            className="bg-slate-400 rounded-xl m-1 px-2 py-5 active:bg-slate-500"
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
    const removeSavedBusStop = async (busStopCode: string) => {
      try {
        const savedBusStops = await AsyncStorage.getItem("savedBusStops");
        if (savedBusStops) {
          const savedBusStopsArray = JSON.parse(savedBusStops) as string[];
          const index = savedBusStopsArray.indexOf(busStopCode);
          if (index > -1) {
            console.log("Removing bus stop: ", busStopCode);
            savedBusStopsArray.splice(index, 1);
          }
          await AsyncStorage.setItem(
            "savedBusStops",
            JSON.stringify(savedBusStopsArray)
          );
        }
      } catch (error) {
        console.error("Error saving bus stop: ", error);
      }
    };
    if (busStopNameMapping) {
      if (busStopNameMapping.length !== 0) {
        return (
          <View className="w-full h-3/4 bg-transparent rounded-xl">
            <SwipeListView
              className="w-full h-full mt-3 bg-slate-600 rounded-xl p-3 overflow-y-auto"
              data={busStopNameMapping}
              renderItem={renderSavedBusStops}
              keyExtractor={(item) => item.busStopCode}
              renderHiddenItem={({ item }: { item: BusStopGeneralInfo }) => (
                <View className="w-full h-full p-3 pb-6 flex-row justify-between">
                  <View className="bg-transparent w-14 h-full" />
                  <Pressable
                    className="bg-red-500 w-20 h-full rounded-xl active:opacity-75 p-1 items-center justify-center"
                    onPress={async () => {
                      await removeSavedBusStop(item.busStopCode);
                      setTriggerRefresh(true);
                    }}
                  >
                    <MaterialIcons name="delete" size={34} color="white" />
                  </Pressable>
                </View>
              )}
              rightOpenValue={-95}
              previewRowKey={"0"}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              previewDuration={1000}
              disableLeftSwipe={false}
              disableRightSwipe={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
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
