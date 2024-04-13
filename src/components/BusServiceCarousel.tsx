import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, RefreshControl, Vibration } from "react-native";
import AlertModal from "./AlertModal";
import AlertButton from "./ui/AlertButton";
import {
  getBusAlertSettings,
  removeBusAlertSettings,
  saveBusAlertSettings,
} from "../utils/BusAlerts";
import { BusAlert } from "../types";
import useBusStopDb from "../hooks/UseBusStopDb";

interface BusServiceCarouselProps {
  savedBusAlerts: BusAlert[];
  busstopId: string;
  busServiceMapping: Map<string, string[]>[];
  isRefreshing: boolean;
  onRefresh: () => void;
}

interface SelectedBusService {
  busService: string;
  nextBusArrival: string;
}

const BusServiceCarousel: React.FC<BusServiceCarouselProps> = ({
  savedBusAlerts,
  busstopId,
  busServiceMapping,
  isRefreshing,
  onRefresh,
}) => {
  const [selectedBusService, setSelectedBusService] =
    useState<SelectedBusService>({ busService: "", nextBusArrival: "" });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [enabledAlerts, setEnabledAlerts] = useState<string[]>([]);
  const { busStopMap } = useBusStopDb();
  const busServices = busStopMap?.get(busstopId)?.BusServices;
  const [sortedBusServices, setSortedBusServices] = useState<string[]>([]);

  useEffect(() => {
    // sort bus services:
    // 1. enabled alerts
    // 2. other active bus services
    // 3. inactive bus services
    const sortBusServices = (busServices: string[] | undefined) => {
      if (!busServices) return [];
      const alertEnabledBuses: string[] = [];
      const activeServices: string[] = [];
      const inactiveServices: string[] = [];
      busServices.forEach((service) => {
        if (enabledAlerts.includes(service)) {
          alertEnabledBuses.push(service);
        } else if (busServiceMapping.find((mapping) => mapping.has(service))) {
          activeServices.push(service);
        } else {
          inactiveServices.push(service);
        }
      });
      const sorted = alertEnabledBuses
        .concat(activeServices)
        .concat(inactiveServices);
      // console.log("before sort", busServices);
      // console.log("after sort", sorted);
      setSortedBusServices(sorted);
    };

    sortBusServices(busServices);
  }, [enabledAlerts, busServices, busServiceMapping]);

  // Effect to fetch bus alert settings on component mount
  useEffect(() => {
    setEnabledAlerts(
      savedBusAlerts
        .filter((alert) => alert.busstopId === busstopId)
        .map((alert) => alert.busNumber)
    );
  }, [savedBusAlerts]);

  const renderBusTiming = ({ item }: { item: string }) => {
    // extract bus timings from busServiceMapping
    // Map<string, string[]>[]
    const busTimings = busServiceMapping
      .find((mapping) => mapping.has(item))
      ?.get(item) as string[];

    const handleEnableAlert = (busService: string, nextBusArrival: string) => {
      setSelectedBusService({ busService, nextBusArrival }); // Store selected bus service for modal
      Vibration.vibrate(50);
      setModalVisible(true); // Show modal
    };

    const isAlertEnabled = (busNumber: string): boolean => {
      return enabledAlerts.includes(busNumber);
    };

    const processTimeArrivalString = (value: string): string => {
      if (Number(value) <= 0) {
        return "Arriving";
      } else if (String(value) === "NaN") {
        return "NA";
      } else {
        return value + " min";
      }
    };

    return (
      <View className="mb-4">
        {item && busTimings != undefined ? (
          <View
            className="py-2 px-2 rounded-xl bg-slate-400 flex-row justify-between"
            key={item}
          >
            <View>
              <Text className="px-2 text-2xl pt-2 pb-3 font-semibold">
                Bus {item}
              </Text>
              <Text className="px-2 pb-1">
                {busTimings.map((timing, index) => (
                  <Text key={index}>
                    {processTimeArrivalString(timing)}
                    {index === busTimings.length - 1 ? "" : ", "}
                  </Text>
                ))}
              </Text>
            </View>
            <AlertButton
              isAlertEnabled={isAlertEnabled(item)}
              onPress={async () => {
                if (!isAlertEnabled(item)) {
                  // console.log("Enabling alert for bus", key);
                  handleEnableAlert(item, busTimings[0]);
                } else {
                  // Disable alert
                  // console.log("Disabling alert for bus", key);
                  await removeBusAlertSettings(busstopId, item);
                  setEnabledAlerts(
                    (await getBusAlertSettings(busstopId)).map(
                      (alert: BusAlert) => alert.busNumber
                    )
                  );
                }
              }}
            />
          </View>
        ) : (
          <View
            className="py-2 px-2 rounded-xl bg-slate-500 flex-row justify-between"
            key={item}
          >
            <View>
              <Text className="px-2 text-2xl pt-2 pb-3 font-semibold">
                Bus {item}
              </Text>
              <Text className="px-2 italic pb-1">Service Unavailable</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View>
      {sortedBusServices ? (
        <FlatList
          className="w-full h-full bg-slate-600 mt-5 mb-6 p-3 rounded-xl"
          data={sortedBusServices}
          renderItem={renderBusTiming}
          keyExtractor={(_, index: number) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <></>
      )}
      <AlertModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedBusService({ busService: "", nextBusArrival: "" });
        }}
        onConfirm={async (time) => {
          await saveBusAlertSettings(
            busstopId,
            selectedBusService.busService,
            time
          );
          setEnabledAlerts(
            (await getBusAlertSettings(busstopId)).map(
              (alert: BusAlert) => alert.busNumber
            )
          );
          setSelectedBusService({ busService: "", nextBusArrival: "" });
        }}
        upperLimit={
          selectedBusService.nextBusArrival
            ? Number(selectedBusService.nextBusArrival)
            : 5
        }
      />
    </View>
  );
};

export default BusServiceCarousel;
