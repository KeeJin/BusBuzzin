import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Notifications from 'expo-notifications';

import FetchInfoByBusStopCode from "./services/api/FetchInfoByBusStopCode";
import { getBusAlertSettings, removeBusAlertSettings } from "./utils/BusAlerts";
import HomeScreen from "./pages/HomeScreen";
import BusStopDashboardScreen from "./pages/BusStopDashboardScreen";
import SavedBusStopsScreen from "./pages/SavedBusStopsScreen";
import SettingsScreen from "./pages/SettingsScreen";
import calculateMinutesToArrival from "./utils/CalculateEta";
import { Vibration } from "react-native";

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();
const BACKGROUND_ALERTS_TASK = "background-alerts";
TaskManager.defineTask(BACKGROUND_ALERTS_TASK, async () => {
  // console.log("Running background task");
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
        // Send notification (TODO)
        Vibration.vibrate(500);

        // Remove the alert
        await removeBusAlertSettings(busStopCode as string, busNumber);
      }
    }
  });
  await Promise.all(promises);

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_ALERTS_TASK, {
    minimumInterval: 10, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

export default function App() {
  useEffect(() => {
    registerBackgroundFetchAsync();
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
