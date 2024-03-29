import { useQuery } from "react-query";
import FetchInfoByBusStopCode from "../services/api/FetchInfoByBusStopCode";
import calculateMinutesToArrival from "../utils/CalculateEta";

const useBusArrivalQuery = (
  shouldGrab: boolean,
  busstopId: string | undefined,
  callbackFn: () => void
) => {
  return useQuery(
    ["busArrivalData", shouldGrab, busstopId],
    async ({ queryKey }): Promise<any> => {
      const [_, shouldGrab, busstopId] = queryKey;
      if (!busstopId) return; // Don't make the request if busstopId is empty
      if (!shouldGrab) return; // Don't make the request if shouldGrab is false
      const response = await FetchInfoByBusStopCode(busstopId as string);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // console.log(data);
      const busServiceData: Map<string, string[]>[] = [];
      if (data["Services"] !== undefined) {
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
          busServiceData.push(
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
      }
      return busServiceData;
    },
    {
      enabled: !!busstopId, // Only fetch data if busstopId is truthy
      refetchInterval: 0, // Refetch every 5 seconds
      onError: callbackFn,
      // onSuccess: callbackFn,
    }
  );
};

export default useBusArrivalQuery;
