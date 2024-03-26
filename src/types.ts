type RootStackParamList = {
  BusStopDashboard: { id: string };
  Home: undefined;
  SavedBusStops: undefined;
  Settings: undefined;
};

interface BusAlert {
  busstopId: string;
  busNumber: string;
  notificationTime: number;
}

export { RootStackParamList, BusAlert };