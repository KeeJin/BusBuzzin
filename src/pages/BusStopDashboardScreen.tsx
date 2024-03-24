import React, { useState, useEffect } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "react-query";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useBusArrivalQuery from "../hooks/UseBusArrivalQuery";
import useBusStopMap from "../hooks/UseBusStopMap";
import { RootStackParamList } from "../types";
import BookmarkButton from "../components/ui/BookmarkButton";

type BusStopDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "BusStopDashboard">;
  route: RouteProp<RootStackParamList, "BusStopDashboard">;
};

const BusStopDashboardScreen: React.FC<BusStopDashboardScreenProps> = ({
  navigation,
  route,
}) => {
  const [shouldGrab, setShouldGrab] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean | undefined>(undefined);
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

  const renderTimeArrival = (value: string) => {
    if (Number(value) <= 0) {
      return "Arriving";
    } else if (String(value) === "NaN") {
      return "NA";
    } else {
      return value + " min";
    }
  };

  const renderBusTiming = ({ item }: { item: Map<string, string[]> }) => {
    // console.log("busServiceData: ", busServiceData);
    return (
      <View className="mb-4">
        {item != undefined &&
          Array.from(item.entries()).map(([key, values], index) => (
            <View className="py-2 px-1 rounded-xl bg-slate-400" key={index}>
              <Text className="px-2 text-xl p-1">Bus {key}</Text>
              <Text className="px-2">
                {values.map((value, index) => (
                  <Text key={index}>
                    {renderTimeArrival(value)}
                    {index === values.length - 1 ? "" : ", "}
                  </Text>
                ))}
              </Text>
            </View>
          ))}
      </View>
    );
  };

  const onBookmarkPress = () => {
    setIsSaved(!isSaved);
  };

  useEffect(() => {
    const fetchSavedBusStops = async () => {
      try {
        const savedBusStops = await AsyncStorage.getItem("savedBusStops");
        if (savedBusStops) {
          const savedBusStopsArray = JSON.parse(savedBusStops) as string[];
          if (savedBusStopsArray.includes(busstopId)) {
            setIsSaved(true);
          }
        }
      } catch (error) {
        console.error("Error fetching saved bus stops: ", error);
      }
    };
    fetchSavedBusStops();
  }, []);

  useEffect(() => {
    const saveBusStop = async () => {
      if (isSaved === undefined) {
        return;
      }
      try {
        const savedBusStops = await AsyncStorage.getItem("savedBusStops");
        if (savedBusStops) {
          const savedBusStopsArray = JSON.parse(savedBusStops) as string[];
          if (isSaved) {
            if (!savedBusStopsArray.includes(busstopId)) {
              console.log("Saving bus stop: ", busstopId);
              savedBusStopsArray.push(busstopId);
            }
          } else {
            const index = savedBusStopsArray.indexOf(busstopId);
            if (index > -1) {
              console.log("Removing bus stop: ", busstopId);
              savedBusStopsArray.splice(index, 1);
            }
          }
          await AsyncStorage.setItem(
            "savedBusStops",
            JSON.stringify(savedBusStopsArray)
          );
        } else {
          await AsyncStorage.setItem(
            "savedBusStops",
            JSON.stringify([busstopId])
          );
        }
      } catch (error) {
        console.error("Error saving bus stop: ", error);
      }
    };
    saveBusStop();
  }, [isSaved]);

  return (
    <View className="bg-slate-800 w-full h-full items-center justify-center px-6">
      <View className="w-full h-fit bg-transparent flex-row items-center justify-between pt-10 pl-2">
        <Text
          numberOfLines={2}
          className="text-3xl w-5/6 text-white text-left font-semibold"
        >
          {busStopName ? `${busStopName}` : `Loading Description...`}
        </Text>
        <BookmarkButton
          isSaved={isSaved ? isSaved : false}
          onPress={onBookmarkPress}
        />
      </View>
      <Text className="w-full text-left text-md text-white pl-2 font-light">
        Bus services for bus stop: {busstopId}
      </Text>
      <View className="w-full h-3/4 bg-transparent mb-5 rounded-xl">
        {isError && (
          <Text className="text-white text-md mt-5">
            Error occured. ({String(error)})
          </Text>
        )}
        {busServiceData ? (
          // <Text className="text-white text-md mt-5">
          //     data?.busServiceData: {busServiceData}
          // </Text>
          <FlatList
            className="w-full h-full bg-slate-600 mt-5 mb-6 p-3 rounded-xl"
            data={busServiceData}
            renderItem={renderBusTiming}
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
