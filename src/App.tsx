import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./pages/HomeScreen";
import BusStopDashboardScreen from "./pages/BusStopDashboardScreen";
import SavedBusStopsScreen from "./pages/SavedBusStopsScreen";
import SettingsScreen from "./pages/SettingsScreen";

const Stack = createNativeStackNavigator();

const queryClient = new QueryClient();

const App = () => {
  return (
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
  );
};

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

registerRootComponent(Root);
