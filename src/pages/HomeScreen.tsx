import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, ActivityIndicator } from "react-native";
import { useMutation, useQueryClient } from "react-query";
import useBusArrivalQuery from "../hooks/UseBusArrivalQuery";
import { StatusBar } from "expo-status-bar";
import Button from "../components/ui/Button";

const HomeScreen: React.FC = (/*{navigation}*/) => {
  const [busstopId, setBusstopId] = useState<string>("");
  const [shouldGrab, setShouldGrab] = useState<boolean>(false);
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // console.log("Bus stop ID changed: " + busstopId);
    if (shouldGrab) {
      setShouldGrab(false);
    }
  }, [busstopId]);

  const { data, isLoading, error, isError } = useBusArrivalQuery(
    shouldGrab,
    busstopId,
    () => {
      setShouldGrab(false);
    }
  );

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      setShouldGrab(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["busArrivalData"]);
    },
  });

  const renderItem = ({ item }: { item: Map<string, string[]> }) => (
    <View style={{ marginVertical: 10 }}>
      {Array.from(item.entries()).map(([key, values], index) => (
        <View className="py-2 px-1 rounded-xl bg-blue-50" key={index}>
          <Text className="px-2 text-xl p-1">Bus {key}</Text>
          <Text className="px-2">
            {values[0]} min, {values[1]} min, {values[2]} min
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View className="bg-black w-full h-full items-center">
      <Text className="text-3xl text-white text-center mt-5">Bus Buzz!!</Text>
      <View className="w-3/4 h-4/5 mt-3 bg-transparent items-center">
        <Text className="text-xl text-white text-center my-1">
          Quick Search
        </Text>
        <TextInput
          className="w-3/4 bg-gray-400 my-3 text-white text-center rounded-xl"
          onChangeText={setBusstopId}
          value={busstopId}
          placeholder="Search with bus stop code..."
          autoFocus={false}
        ></TextInput>
        <Button
          title="Search"
          onPress={async () => {
            try {
              await mutateAsync();
            } catch (e) {
              console.error(e);
            }
          }}
        />
        {isLoading && (
            <ActivityIndicator className="mt-5" size="large" color="white" />
          )}
          {isError && (
            <Text className="text-white text-md mt-5">{String(error)}</Text>
          )}
          {!isLoading && !isError && shouldGrab ? (
            <FlatList
              className="w-full h-1/2 bg-transparent mt-7 p-2 rounded-xl"
              data={data}
              renderItem={renderItem}
              keyExtractor={(_, index: number) => index.toString()}
            />
          ) : (
            <></>
          )}
      </View>
      <StatusBar style="inverted" translucent={false} hidden={false} />
    </View>
  );
};

export default HomeScreen;