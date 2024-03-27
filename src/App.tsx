import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";

import FetchInfoByBusStopCode from "./services/api/FetchInfoByBusStopCode";
import { getBusAlertSettings, removeBusAlertSettings } from "./utils/BusAlerts";
import calculateMinutesToArrival from "./utils/CalculateEta";

import HomeScreen from "./pages/HomeScreen";
import BusStopDashboardScreen from "./pages/BusStopDashboardScreen";
import SavedBusStopsScreen from "./pages/SavedBusStopsScreen";
import SettingsScreen from "./pages/SettingsScreen";
import SavedBusAlertsScreen from "./pages/BusAlertsScreen";

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();
const BACKGROUND_ALERTS_TASK = "background-alerts";
TaskManager.defineTask(BACKGROUND_ALERTS_TASK, async () => {
  console.log("Running background task");
  const busAlertSettings = await getBusAlertSettings("");

  const promises = busAlertSettings.map(async (busAlert) => {
    const busStopCode = busAlert.busstopId;
    const busNumber = busAlert.busNumber;
    const notificationTime = busAlert.notificationTime;

    const response = await FetchInfoByBusStopCode(busStopCode as string);
    if (!response.ok) {
      console.error("Network response was not ok");
      return;
    }

    const data = await response.json();
    if (data["Services"] !== undefined) {
      const busArrivals = data["Services"].find(
        (service: any) => service["ServiceNo"] === busNumber
      )?.NextBus;

      if (!busArrivals) return;
      const eta = calculateMinutesToArrival(busArrivals["EstimatedArrival"]);
      if (eta <= notificationTime) {
        console.log("Bus is arriving soon!");
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Bus is arriving soon!",
            body: `Bus ${busNumber} is arriving in ${eta} minutes`,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            vibrate: [0, 500, 500, 500, 500, 500, 500, 3000,],
            sound: "default",
          },
          trigger: null,
        });

        // Remove the alert
        await removeBusAlertSettings(busStopCode as string, busNumber);
      }
    }
  });
  await Promise.all(promises);

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

const registerBackgroundFetchAsync = async () => {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_ALERTS_TASK, {
    minimumInterval: 10, // 10s
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
};

const allowsNotificationsAsync = async (): Promise<boolean> => {
  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
};

const requestNotificationsIfNotGranted = async () => {
  const allowed = await allowsNotificationsAsync();
  if (allowed) return;
  await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });
};

const notificationChannelExists = async () => {
  const channels = await Notifications.getNotificationChannelsAsync();
  return channels.some((channel) => channel.name === "bus-alerts");
};

const createNotificationChannelIfNotExists = async () => {
  const exists = await notificationChannelExists();
  if (exists) return;
  await Notifications.setNotificationChannelAsync("bus-alerts", {
    name: "Bus Alerts",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    vibrationPattern: [0, 500, 500, 500, 500, 500, 500, 3000,],
  });
};

export default function App() {
  useEffect(() => {
    const init = async () => {
      await requestNotificationsIfNotGranted();
      await createNotificationChannelIfNotExists();
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
      await registerBackgroundFetchAsync();
    };
    init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar style="light" translucent={true} hidden={false} />
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BusStopDashboard"
            component={BusStopDashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SavedBusStops"
            component={SavedBusStopsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SavedBusAlertsScreen"
            component={SavedBusAlertsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

registerRootComponent(App);
