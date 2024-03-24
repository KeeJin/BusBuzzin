import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useSavedBusStops = (): string[] | undefined => {
  const [savedBusStops, setSavedBusStops] = useState<string[]>();

  useEffect(() => {
    const fetchSavedBusStops = async () => {
      try {
        const savedBusStops = await AsyncStorage.getItem("savedBusStops");
        if (savedBusStops) {
          setSavedBusStops(JSON.parse(savedBusStops));
        }
      } catch (error) {
        console.error("Error fetching saved bus stops:", error);
      }
    };
    fetchSavedBusStops();
  }, []);

  return savedBusStops;
};

export default useSavedBusStops;
