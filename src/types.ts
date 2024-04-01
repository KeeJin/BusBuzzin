type RootStackParamList = {
  BusStopDashboard: { id: string };
  Home: undefined;
  SavedBusStops: undefined;
  Settings: undefined;
  SavedBusAlerts: undefined;
  Map: undefined;
};

interface BusStop {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
}

type BusStopMap = Map<string, BusStop>;
type BusStopArray = string[];

interface BusStopData {
  busStopMap: BusStopMap | undefined;
  busStopArray: BusStopArray | undefined;
}

interface BusAlert {
  busstopId: string;
  busNumber: string;
  notificationTime: number;
}

type BusStopGeneralInfo = {
  busStopCode: string;
  description: string;
};

export {
  RootStackParamList,
  BusAlert,
  BusStopGeneralInfo,
  BusStop,
  BusStopData,
  BusStopMap,
  BusStopArray,
};
