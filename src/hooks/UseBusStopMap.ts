import { useEffect, useState } from 'react';
import * as busStopsJson from '../assets/busstops.json';

type BusStop = {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
};

type BusStopMap = Map<string, BusStop>;

const useBusStopMap = (): BusStopMap | undefined => {
  const [busStopMap, setBusStopMap] = useState<BusStopMap>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Extract the 'value' array from the JSON data
        const busStops: BusStop[] = busStopsJson["value"];

        // Convert the array to a Map
        const map = new Map<string, BusStop>();
        busStops.forEach((busStop) => {
          map.set(busStop.BusStopCode, busStop);
        });

        // Set the Map in the state
        setBusStopMap(map);
      } catch (error) {
        console.error('Error fetching bus stop data:', error);
      }
    };

    // Fetch data on component mount
    fetchData();
  }, []);

  return busStopMap;
};

export default useBusStopMap;