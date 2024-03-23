import { useQuery } from "react-query";
import FetchInfoByBusStopCode from "../services/api/FetchInfoByBusStopCode";

const calculateMinutesToArrival = (arrivalTimeString: string): number => {
  // Parse the arrival time string into a Date object
  const arrivalTime = new Date(arrivalTimeString);
  // console.log("Arrival Time: " + arrivalTime.getTime());

  // Get the current time
  const currentTime = new Date();
  // console.log("Current Time: " + currentTime.getTime());

  // Calculate the time difference in milliseconds
  const timeDifferenceMs = arrivalTime.getTime() - currentTime.getTime();
  // console.log("Time Difference: " + timeDifferenceMs);

  // Convert the time difference to minutes
  const minutesToArrival = Math.round(timeDifferenceMs / (1000 * 60));
  // console.log("Minutes to Arrival: " + minutesToArrival);

  return minutesToArrival;
};

const useBusArrivalQuery = (shouldGrab: boolean, busstopId: string | undefined, callbackFn: () => void) => {
  return useQuery(
    ["busArrivalData", shouldGrab, busstopId],
    async ({ queryKey }) => {
      const [_, shouldGrab, busstopId] = queryKey;
      if (!busstopId) return; // Don't make the request if busstopId is empty
      if (!shouldGrab) return; // Don't make the request if shouldGrab is false
      const response = await FetchInfoByBusStopCode(busstopId as string);
      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }

      const data = await response.json();
      console.log(data);

      if (data["Services"] !== undefined) {
        let arrivalData: Map<string, Array<string>>[] = [];
        data["Services"].forEach((service: any) => {
          const serviceNo = service["ServiceNo"];
          const nextBusArrival = calculateMinutesToArrival(
            service["NextBus"]["EstimatedArrival"]
          );
          const nextBus2Arrival = calculateMinutesToArrival(
            service["NextBus2"]["EstimatedArrival"]
          );
          const nextBus3Arrival = calculateMinutesToArrival(
            service["NextBus3"]["EstimatedArrival"]
          );
          arrivalData.push(
            new Map([
              [
                serviceNo,
                [
                  nextBusArrival.toString(),
                  nextBus2Arrival.toString(),
                  nextBus3Arrival.toString(),
                ],
              ],
            ])
          );
        });
        return arrivalData;
      }
    },
    {
      enabled: !!busstopId, // Only fetch data if busstopId is truthy
      refetchInterval: 5000, // Refetch every 5 seconds
      onError: callbackFn,
      // onSuccess: callbackFn,
    }
  );
};

export default useBusArrivalQuery;
