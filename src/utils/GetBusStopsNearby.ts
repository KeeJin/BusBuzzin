import useBusStopDb from "../hooks/UseBusStopDb";
import { BusStop, BusStopData } from "../types";
import { LatLng } from "react-native-maps";

// Function to calculate the distance between two coordinates in meters
const CalculateDistanceBetweenCoordinates = (
  coord1: LatLng,
  coord2: LatLng
): number => {
  const deltaLat = Math.abs(coord1.latitude - coord2.latitude);
  const deltaLon = Math.abs(coord1.longitude - coord2.longitude);

  // Multiply degrees of separation of longitude and latitude by 111,139 to get corresponding linear distances in meters
  // This approximation is accurate for small distances like within Singapore
  const latDistance = deltaLat * 111139;
  const lonDistance = deltaLon * 111139;

  return Math.sqrt(Math.pow(latDistance, 2) + Math.pow(lonDistance, 2));
};

// Function to get bus stops nearby a given location within a certain search radius
// Note: search radius is in meters
const GetBusStopsNearby = (
  latitude: number,
  longitude: number,
  searchRadius: number,
  busStopMap: Map<string, BusStop>
) => {
  if (!busStopMap) {
    return [];
  }
  const busStops = Array.from(busStopMap.values()); // Convert iterator to array
  
  const nearbyBusStops = busStops.filter((busStop: BusStop): boolean => {
    const distance = CalculateDistanceBetweenCoordinates(
      { latitude, longitude },
      { latitude: busStop.Latitude, longitude: busStop.Longitude }
    );
    return distance < searchRadius;
  });
//   console.log(nearbyBusStops.map((busStop) => busStop.Description));

  return nearbyBusStops;
};

export default GetBusStopsNearby;
