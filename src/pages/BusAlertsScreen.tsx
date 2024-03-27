import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, Vibration } from "react-native";
import useBusStopMap from "../hooks/UseBusStopMap";
import { getBusAlertSettings } from "../utils/BusAlerts";
import { BusAlert } from "../types";

const SavedBusAlertsScreen: React.FC = () => {
  const busStopMap = useBusStopMap();
  const [activeBusAlerts, setActiveBusAlerts] = useState<BusAlert[]>([]);

  useEffect(() => {
    const fetchBusAlerts = async () => {
      const busAlertSettings = await getBusAlertSettings("");
      setActiveBusAlerts(busAlertSettings);
    };
    fetchBusAlerts();
  }, []);

  const renderSavedBusAlerts = ({ item }: { item: BusAlert }) => {
    return (
      <View className="mb-4">
        {item && (
          <Pressable
            className="bg-slate-400 active:opacity-75 rounded-xl m-1 p-2 active:bg-red-500"
            onPress={() => {}}
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
                  {busStopMap?.has(item.busstopId) ?
                    busStopMap.get(item.busstopId)?.Description : item.busstopId}
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
            <FlatList
              className="w-full h-full mt-3 bg-slate-600 rounded-xl p-3 overflow-y-auto"
              data={activeBusAlerts}
              renderItem={renderSavedBusAlerts}
              keyExtractor={(item) => item.busNumber + item.busstopId}
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

  if (activeBusAlerts && activeBusAlerts.length === 0) {
    return (
      <View className="bg-slate-800 flex h-full px-6 py-10">
        <Text className="text-white text-center text-3xl">
          No saved bus alerts.{" "}
        </Text>
      </View>
    );
  }

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
