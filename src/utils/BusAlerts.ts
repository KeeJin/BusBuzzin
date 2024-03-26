import AsyncStorage from "@react-native-async-storage/async-storage";
import { BusAlert } from "../types";

const getBusAlertSettings = async (busstopId: string): Promise<BusAlert[]> => {
  try {
    const alerts = await AsyncStorage.getItem("busAlerts", (error) => {
      if (error) {
        console.error("Error fetching bus alert settings:", error);
      }
    });
    if (!alerts) return [];

    let busStopAlerts;
    if (busstopId === "") {
      // fetch all alerts
      busStopAlerts = JSON.parse(alerts);
    } else {
      busStopAlerts = JSON.parse(alerts).filter(
        (alert: BusAlert) => alert.busstopId === busstopId
      );
    }
    // console.log("Fetched bus stop alerts: ", busStopAlerts);
    return busStopAlerts;
  } catch (error) {
    console.error("Error fetching bus alert settings:", error);
    return [];
  }
};

const saveBusAlertSettings = async (
  busstopId: string,
  busNumber: string,
  notificationTime: number
) => {
  try {
    const existingSettings = await AsyncStorage.getItem("busAlerts");
    let alerts: BusAlert[] = existingSettings
      ? JSON.parse(existingSettings)
      : [];
    if (!alerts.includes({ busstopId, busNumber, notificationTime })) {
      alerts.push({ busstopId, busNumber, notificationTime });
    }
    await AsyncStorage.setItem("busAlerts", JSON.stringify(alerts));
  } catch (error) {
    console.error("Error saving bus alert settings:", error);
  }
};

const removeBusAlertSettings = async (busstopId: string, busNumber: string) => {
  try {
    const existingSettings = await AsyncStorage.getItem("busAlerts");
    let alerts: BusAlert[] = existingSettings
      ? JSON.parse(existingSettings)
      : [];
    console.log("Settings before removal: ", alerts);
    alerts = alerts.filter(
      (alert: BusAlert) =>
        alert.busstopId! == busstopId && alert.busNumber !== busNumber
    );
    console.log("Settings after removal: ", alerts);
    await AsyncStorage.setItem("busAlerts", JSON.stringify(alerts));

    console.log("Removed bus alert settings for bus number: ", busNumber);
    return;
  } catch (error) {
    console.error("Error removing bus alert settings:", error);
  }
};

export { getBusAlertSettings, saveBusAlertSettings, removeBusAlertSettings };
