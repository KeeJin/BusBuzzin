const api_key = process.env.EXPO_PUBLIC_TOKEN as string | undefined;
if (api_key === undefined) {
  console.log("API key not found.");
}
console.log(api_key);

const FetchInfoByBusStopCode = async (busstopId: string) => {
  // console.log("Fetching data for bus stop code: " + busstopId);
  const response = await fetch(
    "http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=" +
      busstopId,
    {
      method: "GET",
      headers: {
        AccountKey: api_key as string,
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    console.log("Network response was not ok", response.statusText);
    // throw new Error("Network response was not ok");
  }
  return response;
};

export default FetchInfoByBusStopCode;
