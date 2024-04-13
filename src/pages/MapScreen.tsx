import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import GetBusStopsNearby from "../utils/GetBusStopsNearby";
import { BusStop, BusStopData } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import useBusStopDb from "../hooks/UseBusStopDb";
import * as mapStyle from "../assets/mapStyle.json";
import BusStopSearchBar from "../components/BusStopSearchBar";

interface MapScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "Map">;
}

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [nearbyBusStops, setNearbyBusStops] = useState<BusStop[]>([]);
  const { busStopMap } = useBusStopDb() as BusStopData;
  const [busstopId, setBusstopId] = useState<string>("");
  const mapViewRef = useRef<MapView | null>(null);

  const handleSearchConfirm = (id: string) => {
    setBusstopId(id);
    if (id === "") {
      return;
    }
    if (!busStopMap) {
      return;
    }

    let shouldSearch = false;
    if (busStopMap.has(id)) {
      shouldSearch = true;
    }

    if (id.length >= 5 && busStopMap.has(id.slice(-6, -1))) {
      shouldSearch = true;
      id = id.slice(-6, -1);
    }

    if (shouldSearch) {
      const newLocation = {
        coords: {
          latitude: busStopMap.get(id)?.Latitude || 0,
          longitude: busStopMap.get(id)?.Longitude || 0,
        },
      } as Location.LocationObject;
      setLocation(newLocation);
      mapViewRef.current?.animateCamera(
        {
          center: {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          },
          pitch: 0,
          heading: 0,
          altitude: 0,
          zoom: 18,
        },
        { duration: 1500 }
      );
    } else {
      alert("Invalid bus stop entry!");
    }
    Keyboard.dismiss();
  };

  // const [mapRegionShown, setMapRegionShown] = useState({
  //   latitude: 1.3521,
  //   longitude: 103.8198,
  //   latitudeDelta: 0.0922,
  //   longitudeDelta: 0.0421,
  // });

  // Note: switch to Location.Accuracy.Highest if necessary
  // Location.watchPositionAsync({ distanceInterval: 10, accuracy: Location.Accuracy.High }, (location) => {
  //   console.log("Location updated.");
  //   setLocation(location);
  // });

  useEffect(() => {
    const fetchLocation = async () => {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    if (location && busStopMap) {
      const nearbyBusStops = GetBusStopsNearby(
        location.coords.latitude,
        location.coords.longitude,
        500,
        busStopMap
      );
      // console.log(nearbyBusStops);
      setNearbyBusStops(nearbyBusStops);
    }
  }, [location]);

  return (
    <View className="bg-slate-800 w-full h-full items-center flex-col justify-between pt-20 pb-9">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="w-full flex-col px-2">
          <View className="w-full">
            <Text className="text-white text-3xl text-left pl-5 mt-5">
              Search Near Me
            </Text>
          </View>
          <View className="w-full h-32 z-10 px-2 items-center rounded-2xl">
            <BusStopSearchBar
              title=""
              userInput={busstopId}
              onTextChange={setBusstopId}
              onSuggestionAccept={handleSearchConfirm}
              onConfirm={() => {
                handleSearchConfirm(busstopId);
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      {location ? (
        <MapView
          className="w-full h-4/5 mb-2"
          ref={mapViewRef}
          provider={PROVIDER_GOOGLE}
          initialCamera={{
            center: {
              latitude: location?.coords.latitude || 0,
              longitude: location?.coords.longitude || 0,
            },
            pitch: 0,
            heading: 0,
            altitude: 0,
            zoom: 18,
          }}
          loadingEnabled={true}
          showsUserLocation={true}
          minZoomLevel={16}
          maxZoomLevel={18}
          showsTraffic={true}
          onRegionChangeComplete={(region) => {
            const location = {
              coords: {
                latitude: region.latitude,
                longitude: region.longitude,
              },
            } as Location.LocationObject;
            setLocation(location);
          }}
          onPress={() => {
            Keyboard.dismiss();
          }}
          onPanDrag={() => {
            Keyboard.dismiss();
          }}
          customMapStyle={mapStyle}
        >
          {nearbyBusStops.map((busStop) => (
            <Marker
              key={busStop.BusStopCode}
              pinColor="wheat"
              coordinate={{
                latitude: busStop.Latitude,
                longitude: busStop.Longitude,
              }}
              onCalloutPress={(event) => {
                // console.log(event.nativeEvent);
                navigation.navigate("BusStopDashboard", {
                  id: busStop.BusStopCode,
                });
              }}
            >
              <Callout>
                <View className="justify-center items-center py-4 p-2">
                  <Text className="text-lg text-center font-semibold overflow-auto">
                    {busStop.Description}
                  </Text>
                  <Text className="text-xs text-center font-light">
                    {busStop.BusStopCode}, {busStop.RoadName}
                  </Text>
                  <Text className="text-sm">Click for more details</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      ) : (
        <View className="w-full h-full items-center">
          <ActivityIndicator size={64} color="#fff" />
        </View>
      )}
    </View>
  );
};

export default MapScreen;
