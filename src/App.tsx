import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";

import FetchInfoByBusStopCode from "./services/api/FetchInfoByBusStopCode";
import { getBusAlertSettings, removeBusAlertSettings } from "./utils/BusAlerts";
import calculateMinutesToArrival from "./utils/CalculateEta";

import HomeScreen from "./pages/HomeScreen";
import BusStopDashboardScreen from "./pages/BusStopDashboardScreen";
import SavedBusStopsScreen from "./pages/SavedBusStopsScreen";
import MapScreen from "./pages/MapScreen";
import SettingsScreen from "./pages/SettingsScreen";
import SavedBusAlertsScreen from "./pages/BusAlertsScreen";

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();
const BACKGROUND_ALERTS_TASK = "background-alerts";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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
    // console.log("Data fetched for bus stop %s", busStopCode);
    // for (const service of data["Services"]) {
    //   console.log("Bus: %s", service["ServiceNo"]);
    //   console.log("Service: %s", service["NextBus"]["EstimatedArrival"]);
    // }
    if (data["Services"] !== undefined) {
      const busArrivals = data["Services"].find(
        (service: any) => service["ServiceNo"] === busNumber
      )?.NextBus;

      if (!busArrivals) return;
      console.log(
        "Calculating ETA for bus: %s at bus stop %s",
        busNumber,
        busStopCode
      );
      const eta = calculateMinutesToArrival(busArrivals["EstimatedArrival"]);
      if (eta <= notificationTime) {
        console.log("Bus is arriving soon!");
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Bus is arriving soon!",
            body: `Bus ${busNumber} is arriving in ${eta} minutes`,
            priority: Notifications.AndroidNotificationPriority.MAX,
            vibrate: [0, 500, 500, 500, 500, 500, 500, 3000],
            sound: "default",
          },
          trigger: null,
        });

        // Remove the alert
        console.log(
          "Alert fired! Removing alert for bus: %s at bus stop %s",
          busNumber,
          busStopCode
        );
        await removeBusAlertSettings(busStopCode as string, busNumber);
      }
    }
  });
  await Promise.all(promises);
  console.log("All alerts checked!");

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

const registerBackgroundFetchAsync = async () => {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_ALERTS_TASK, {
    minimumInterval: 30, // 10s
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

const requestPermissionsIfNotGranted = async () => {
  const allowed = await allowsNotificationsAsync();
  if (!allowed) {
    await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
  }

  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    alert("Permission to access location was denied");
    return;
  }

  await Location.requestBackgroundPermissionsAsync();
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
    importance: Notifications.AndroidImportance.MAX,
    sound: "default",
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    vibrationPattern: [0, 500, 500, 500, 500, 500, 500, 3000],
  });
};

function App() {
  useQuery(
    "savedBusAlerts", // Unique key for the query
    async () => {
      // Fetch saved alerts
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
        // console.log("Data fetched for bus stop %s", busStopCode);
        // for (const service of data["Services"]) {
        //   console.log("Bus: %s", service["ServiceNo"]);
        //   console.log("Service: %s", service["NextBus"]["EstimatedArrival"]);
        // }
        if (data["Services"] !== undefined) {
          const busArrivals = data["Services"].find(
            (service: any) => service["ServiceNo"] === busNumber
          )?.NextBus;

          if (!busArrivals) return;
          // console.log(
          //   "Calculating ETA for bus: %s at bus stop %s",
          //   busNumber,
          //   busStopCode
          // );
          const eta = calculateMinutesToArrival(
            busArrivals["EstimatedArrival"]
          );
          if (eta <= notificationTime) {
            console.log("Bus is arriving soon!");
            Notifications.scheduleNotificationAsync({
              content: {
                title: "Bus is arriving soon!",
                body: `Bus ${busNumber} is arriving in ${eta} minutes`,
                priority: Notifications.AndroidNotificationPriority.MAX,
                vibrate: [0, 500, 500, 500, 500, 500, 500, 3000],
                sound: "default",
              },
              trigger: null,
            });

            // Remove the alert
            console.log(
              "Alert fired! Removing alert for bus: %s at bus stop %s",
              busNumber,
              busStopCode
            );
            await removeBusAlertSettings(busStopCode as string, busNumber);
          }
        }
      });
      await Promise.all(promises);
      // console.log("All alerts checked!");
      return (await getBusAlertSettings(""));
    },
    {
      enabled: true,
      refetchInterval: 15000, // Refetch every 15 seconds
      onError: () => {
        console.error("Error fetching bus alerts");
      },
      // onSuccess: () => {
      //   console.log("Alerts checked successfully");
      // },
    }
  );

  useEffect(() => {
    const init = async () => {
      await requestPermissionsIfNotGranted();
      await createNotificationChannelIfNotExists();
      await registerBackgroundFetchAsync();
      console.log("Initialisation complete!");
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
            name="MapScreen"
            component={MapScreen}
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

export default function RootApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

registerRootComponent(RootApp);
