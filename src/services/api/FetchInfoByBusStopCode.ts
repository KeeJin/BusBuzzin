const api_key = process.env.EXPO_PUBLIC_TOKEN as string | undefined;
if (api_key === undefined) {
  console.log("API key not found.");
}
console.log(api_key);

const FetchInfoByBusStopCode = async (busStopCode: string) => {
  const response = await fetch(
    "http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=" +
      busStopCode,
    {
      method: "GET",
      headers: {
        AccountKey: api_key as string,
      },
    }
  );
  const data = await response.json();
  return data;
};

export default FetchInfoByBusStopCode;
