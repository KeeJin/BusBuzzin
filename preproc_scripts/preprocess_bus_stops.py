import requests
import json

# ----------------- Functions -----------------
def fetchData():
    url = "http://datamall2.mytransport.sg/ltaodataservice/BusRoutes"
    headers = {'AccountKey': 'yZMs+uoqRw+pVRHSfxKFBA=='}
    skip = 0
    batch_number = 1
    # Make API requests in multiples of 500
    print("Starting data fetching from: ", url)
    while True:
        params = {'$skip': skip}
        response = requests.get(url, headers=headers, params=params)

        # Check for successful response
        if response.status_code == 200:
            # Extract the "value" attribute from the response
            data = response.json()["value"]

            if (len(response.json()['value']) == 0):
                print("No more data to fetch")
                break;

            # Append the data to the all_bus_routes list
            all_bus_routes.extend(data)

            # Update the skip parameter
            skip += 500

            batch_number += 1
            if (batch_number % 10 == 0):
                print(f"Batch number {batch_number} complete.")
                print("Total pool size: ", len(all_bus_routes))
        else:
            print(f"Error: {response.status_code}")
            break
    print("Data fetching complete.")
def searchBusByBusStopCode(bus_stop_code):
    bus_stops = []
    for route in all_bus_routes:
        if route['BusStopCode'] == bus_stop_code:
            bus_stops.append(route['ServiceNo'])
    return bus_stops
def imputeBusServices(element):
    bus_stop_code = element['BusStopCode']
    # print(f"Performing search for buses that serve bus stop {bus_stop_code}...")
    bus_services = searchBusByBusStopCode(bus_stop_code)
    # print("The following buses serve this bus stop: ", bus_services)
    element["BusServices"] = bus_services

# ----------------- Main -----------------
if __name__ == "__main__":
    all_bus_routes = []
    
    fetchData()

    # Opening JSON file
    f = open('./raw_bus_stops.json')

    # returns JSON object as a dictionary
    raw_bus_stops = json.load(f)['value']
    
    print("Imputing bus services into bus stop data...")
    result = map(imputeBusServices, raw_bus_stops)

    for _ in result:
        pass
    
    print("Preprocessing complete. Writing to file...")
    
    # Save the aggregated data as a JSON file
    with open('bus_stops_postproc.json', 'w') as outfile:
        json.dump(raw_bus_stops, outfile)
