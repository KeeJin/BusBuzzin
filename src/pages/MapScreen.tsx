import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

const MapScreen: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  useEffect(() => {
    const getLocation = async () => {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    };
    getLocation();
  }, []);
  return (
    <View className="bg-slate-800 w-full h-full items-center justify-center">
      <Text className="text-3xl text-white text-center font-bold">
        Current Location: {location?.coords.latitude},{" "}
        {location?.coords.longitude}
      </Text>
      {location && (
        <MapView
          className="w-full h-3/4"
          initialRegion={{
            latitude: location?.coords.latitude || 0,
            longitude: location?.coords.longitude || 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          minZoomLevel={16}
          maxZoomLevel={18}
          showsTraffic={true}
          
        >
          {/* <Marker
            coordinate={{
              latitude: location?.coords.latitude || 0,
              longitude: location?.coords.longitude || 0,
            }}
            title="You are here"
            description="You are here"
          /> */}
        </MapView>
      )}
    </View>
  );
};

export default MapScreen;
