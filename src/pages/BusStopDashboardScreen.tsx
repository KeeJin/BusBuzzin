import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Keyboard,
  ActivityIndicator,
  FlatList,
  RefreshControl
} from "react-native";
import { useQueryClient } from "react-query";
import useBusArrivalQuery from "../hooks/UseBusArrivalQuery";
import useBusStopMap from "../hooks/UseBusStopMap";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type BusStopDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "BusStopDashboard">;
  route: RouteProp<RootStackParamList, "BusStopDashboard">;
};

const BusStopDashboardScreen: React.FC<BusStopDashboardScreenProps> = ({
  navigation,
  route,
}) => {
  const [shouldGrab, setShouldGrab] = useState<boolean>(true);
  const [busServiceData, setBusServiceData] = useState<Map<string, string[]>[]>(
    []
  );
  const [busStopName, setBusStopName] = useState<string | undefined>("");
  const queryClient = useQueryClient();
  const busStopMap = useBusStopMap();
  const busstopId = route.params.id as string;

  useEffect(() => {
    const fetchBusStopName = async () => {
        // console.log("Fetching bus stop name for bus stop code: " + busstopId);
      if (busStopMap && busStopMap.has(busstopId)) {
        // console.log("Bus stop name found: " + busStopMap.get(busstopId)?.Description);
        setBusStopName(busStopMap.get(busstopId)?.Description);
      }
    };
    fetchBusStopName();
  }, [busStopMap]);

  const { data, isLoading, error, isError } = useBusArrivalQuery(
    shouldGrab,
    busstopId,
    () => {
      setShouldGrab(false);
      queryClient.invalidateQueries(["busArrivalData"]);
    }
  );

  useEffect(() => {
    // console.log("Bus stop ID: " + busstopId);
    // console.log("busServiceData: ", data.busServiceData);
    // console.log("data.busStopName: ", data.busStopName);
    if (data && !isLoading && !isError) {
      setBusServiceData(data);
    }
  }, [isLoading, data, isLoading, isError]);

  const renderItem = ({ item }: { item: Map<string, string[]> }) => {
    // console.log("busServiceData: ", busServiceData);
    return (
      <View className="my-1">
        {item != undefined &&
          Array.from(item.entries()).map(([key, values], index) => (
            <View className="py-2 px-1 rounded-xl bg-blue-50" key={index}>
              <Text className="px-2 text-xl p-1">Bus {key}</Text>
              <Text className="px-2">
                {values.map((value, index) => (
                  <Text key={index}>
                    {Number(value) <= 0 ? "Arr" : value + " min"}
                    {index === values.length - 1 ? "" : ", "}
                  </Text>
                ))}
              </Text>
            </View>
          ))}
      </View>
    );
  };

  const handlePressAway = () => {
    // Dismiss the keyboard
    Keyboard.dismiss();
  };

  return (
    <View className="bg-slate-800 w-full h-full items-center">
      {busStopName ? (
        <Text className="text-xl text-white text-center my-5">
          {busStopName} ({busstopId})
        </Text>
      ) : (
        <Text className="text-xl text-white text-center my-5">
          Loading Name... ({busstopId})
        </Text>
      )}
      <View className="w-full h-auto bg-transparent p-2 rounded-xl">
        {isLoading && (
          <ActivityIndicator className="mt-5" size="large" color="white" />
        )}
        {isError && (
          <Text className="text-white text-md mt-5">{String(error)}</Text>
        )}
        {busServiceData ? (
          // <Text className="text-white text-md mt-5">
          //     data?.busServiceData: {busServiceData}
          // </Text>
          <FlatList
            className="w-full h-5/6 bg-slate-400 mt-1 p-2 rounded-xl"
            data={busServiceData}
            renderItem={renderItem}
            keyExtractor={(_, index: number) => index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => {
                  setShouldGrab(true);
                  queryClient.invalidateQueries(["busArrivalData"]);
                }}
              />
            }
          />
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default BusStopDashboardScreen;
