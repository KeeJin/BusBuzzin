import { registerRootComponent } from "expo";
import React from "react";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import { NavigationContainer } from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from "./pages/HomeScreen";

const Stack = createNativeStackNavigator();

const queryClient = new QueryClient();

const App = () => {

  // const Item = (title: string, values: string[]) => (
  //   <View className="m-1 rounded-xl bg-blue-50">
  //     <Text className="px-2">{title}</Text>
  //     <Text className="px-2">
  //       {values[0]} min, {values[1]} min, {values[2]} min
  //     </Text>
  //   </View>
  // );

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
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
