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

export default calculateMinutesToArrival;