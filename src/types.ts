type RootStackParamList = {
  BusStopDashboard: { id: string };
  Home: undefined;
  SavedBusStops: undefined;
  Settings: undefined;
  SavedBusAlerts: undefined;
};

interface BusAlert {
  busstopId: string;
  busNumber: string;
  notificationTime: number;
}

type BusStopGeneralInfo = {
  busStopCode: string;
  description: string;
};

export { RootStackParamList, BusAlert, BusStopGeneralInfo };