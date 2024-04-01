import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Vibration } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import useBusStopDb from "../hooks/UseBusStopDb";
import {
  getBusAlertSettings,
  removeBusAlertSettings,
} from "../utils/BusAlerts";
import { BusAlert } from "../types";

type SavedBusAlertsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SavedBusAlerts">;
};

const SavedBusAlertsScreen: React.FC<SavedBusAlertsScreenProps> = ({navigation}) => {
  const { busStopMap } = useBusStopDb();
  const [triggerRefresh, setTriggerRefresh] = useState<boolean>(false);
  const [activeBusAlerts, setActiveBusAlerts] = useState<BusAlert[]>([]);

  const fetchBusAlerts = async () => {
    const busAlertSettings = await getBusAlertSettings("");
    setActiveBusAlerts(busAlertSettings);
  };

  useEffect(() => {
    fetchBusAlerts();
  }, []);

  const renderSavedBusAlerts = ({ item }: { item: BusAlert }) => {
    const reFetchBusAlerts = async () => {
      if (triggerRefresh) {
        await fetchBusAlerts();
        setTriggerRefresh(false);
      }
    };
    reFetchBusAlerts();

    return (
      <View className="mb-4">
        {item && (
          <Pressable
            className="bg-slate-400 rounded-xl m-1 p-2 active:bg-slate-500"
            onPress={() => {
              navigation.replace("BusStopDashboard", {
                id: item.busstopId,
              });
            }}
            onLongPress={() => {
              Vibration.vibrate(20);
            }}
          >
            <View className="flex-row justify-between px-3 py-1 items-center">
              <View className="flex-column justify-between">
                <Text className="text-black text-xs font-semibold">
                  Bus Service
                </Text>
                <Text className="text-black text-3xl font-semibold">
                  {item.busNumber}
                </Text>
              </View>
              <View className="flex-column justify-between">
                <Text className="text-black text-base font-light text-right">
                  {busStopMap?.has(item.busstopId)
                    ? busStopMap.get(item.busstopId)?.Description
                    : item.busstopId}
                </Text>
              </View>
            </View>
            <Text className="text-black text-sm font-light text-center">
              Buzzin' you {item.notificationTime} min in advance!
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  const renderSavedBusAlertsList = () => {
    if (activeBusAlerts) {
      if (activeBusAlerts.length !== 0) {
        return (
          <View className="w-full h-3/4 bg-transparent rounded-xl">
            <SwipeListView
              className="w-full h-full mt-3 bg-slate-600 rounded-xl p-3 overflow-y-auto"
              data={activeBusAlerts}
              renderItem={renderSavedBusAlerts}
              keyExtractor={(item) => item.busNumber + item.busstopId}
              renderHiddenItem={({ item }: { item: BusAlert }) => (
                <View className="w-full h-full p-3 pb-6 flex-row justify-between">
                  <View className="bg-transparent w-14 h-full" />
                  <Pressable
                    className="bg-red-500 w-20 h-full rounded-xl active:opacity-75 p-1 items-center justify-center"
                    onPress={async () => {
                      // console.log("Deleting alert for bus", item.busNumber);
                      removeBusAlertSettings(item.busstopId, item.busNumber);
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
              No saved bus alerts.
            </Text>
          </View>
        );
      }
    }
    return (
      <View className="w-full h-auto mt-3 bg-slate-400 rounded-xl p-3 pb-5 items-center flex">
        <Text className="text-black text-center text-xl mt-3">
          Loading saved bus alerts...
        </Text>
      </View>
    );
  };

  return (
    <View className="bg-slate-800 h-full px-6 justify-center">
      <Text className="text-white text-3xl text-left pl-2">
        Saved Bus Alerts
      </Text>
      {renderSavedBusAlertsList()}
    </View>
  );
};

export default SavedBusAlertsScreen;
