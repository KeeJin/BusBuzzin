import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "react-query";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useBusArrivalQuery from "../hooks/UseBusArrivalQuery";
import useBusStopMap from "../hooks/UseBusStopMap";
import { RootStackParamList } from "../types";
import BookmarkButton from "../components/ui/BookmarkButton";
import BusServiceCarousel from "../components/BusServiceCarousel";

type BusStopDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "BusStopDashboard">;
  route: RouteProp<RootStackParamList, "BusStopDashboard">;
};

const BusStopDashboardScreen: React.FC<BusStopDashboardScreenProps> = ({
  navigation,
  route,
}) => {
  const busstopId = route.params.id as string;

  /* ---------------------------------------------------------------- */

  const [shouldGrab, setShouldGrab] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean | undefined>(undefined);
  const [busStopName, setBusStopName] = useState<string | undefined>("");
  const queryClient = useQueryClient();
  const busStopMap = useBusStopMap();
  const { data, isLoading, error, isError } = useBusArrivalQuery(
    shouldGrab,
    busstopId,
    () => {
      setShouldGrab(false);
      queryClient.invalidateQueries(["busArrivalData"]);
    }
  );

  /* ---------------------------------------------------------------- */

  // Effect to fetch bus stop names corresponding to bus stop codes
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
        {(data && !isLoading && !isError) ? 
        (<BusServiceCarousel
          busstopId={busstopId}
          busServiceMapping={data}
          isRefreshing={isLoading}
          onRefresh={() => {
            setShouldGrab(true);
            queryClient.invalidateQueries(["busArrivalData"]);
          }}
        />) : 
        (<Text className="text-white text-md mt-5">
          Loading bus services...
        </Text>)}
      </View>
    </View>
  );
};

export default BusStopDashboardScreen;
