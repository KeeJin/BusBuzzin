import { useEffect, useState } from 'react';
import * as busStopsJson from '../assets/busstops.json';
import { BusStop, BusStopMap, BusStopArray, BusStopData } from '../types';

const useBusStopDb = (): BusStopData => {
  const [busStopMap, setBusStopMap] = useState<BusStopMap>();
  const [busStopArray, setBusStopArray] = useState<BusStopArray>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Extract the 'value' array from the JSON data
        const busStops: BusStop[] = busStopsJson["value"];

        // Convert the array to a Map
        const map = new Map<string, BusStop>();
        const array: BusStopArray = [];
        busStops.forEach((busStop) => {
          // update map
          map.set(busStop.BusStopCode, busStop);
          
          // update array
          const element = busStop.Description + " (" + busStop.BusStopCode + ")";
          array.push(element);
        });

        setBusStopMap(map);
        setBusStopArray(array);
      } catch (error) {
        console.error('Error fetching bus stop data:', error);
      }
    };

    // Fetch data on component mount
    fetchData();
  }, []);

  return {busStopMap, busStopArray};
};

export default useBusStopDb;