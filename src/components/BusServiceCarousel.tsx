import React, { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl, Vibration } from "react-native";
import AlertModal from "./AlertModal";
import AlertButton from "./ui/AlertButton";
import {
  getBusAlertSettings,
  removeBusAlertSettings,
  saveBusAlertSettings,
} from "../utils/BusAlerts";
import { BusAlert } from "../types";

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

  // Effect to fetch bus alert settings on component mount
  useEffect(() => {
    setEnabledAlerts(savedBusAlerts.map((alert: BusAlert) => alert.busNumber));
  }, [savedBusAlerts]);

  const renderBusTiming = ({ item }: { item: Map<string, string[]> }) => {
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
        {item != undefined &&
          Array.from(item.entries()).map(([key, values], index) => (
            <View
              className="py-2 px-2 rounded-xl bg-slate-400 flex-row justify-between"
              key={index}
            >
              <View>
                <Text className="px-2 text-2xl pt-2 pb-3 font-semibold">
                  Bus {key}
                </Text>
                <Text className="px-2">
                  {values.map((value, index) => (
                    <Text key={index}>
                      {processTimeArrivalString(value)}
                      {index === values.length - 1 ? "" : ", "}
                    </Text>
                  ))}
                </Text>
              </View>
              <AlertButton
                isAlertEnabled={isAlertEnabled(key)}
                onPress={async () => {
                  if (!isAlertEnabled(key)) {
                    // console.log("Enabling alert for bus", key);
                    handleEnableAlert(key, values[0]);
                  } else {
                    // Disable alert
                    // console.log("Disabling alert for bus", key);
                    await removeBusAlertSettings(busstopId, key);
                    setEnabledAlerts(
                      (await getBusAlertSettings(busstopId)).map(
                        (alert: BusAlert) => alert.busNumber
                      )
                    );
                  }
                }}
              />
            </View>
          ))}
      </View>
    );
  };

  return (
    <View>
      {busServiceMapping ? (
        <FlatList
          className="w-full h-full bg-slate-600 mt-5 mb-6 p-3 rounded-xl"
          data={busServiceMapping}
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
