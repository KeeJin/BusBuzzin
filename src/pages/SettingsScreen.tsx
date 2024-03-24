import React from "react";

import { View, Text, TouchableOpacity, Modal } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Settings">;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const clearSavedBusStops = async () => {
    try {
      await AsyncStorage.removeItem("savedBusStops");
    } catch (e) {
      console.error(e);
    }
    setModalVisible(false);
  };

  return (
    <View className="bg-slate-800 flex h-screen px-6 py-10">
      <Text className="text-white text-3xl text-left pl-2 mb-5">Settings</Text>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        activeOpacity={70}
        className="bg-slate-400 active:bg-slate-500 p-3 mx-2 rounded-md"
      >
        <Text className="text-black text-lg font-semibold">
            Clear saved bus stops
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{ backgroundColor: "rgba(156, 163, 175, 0.5)" }}
          className="flex-1 justify-center items-center"
        >
          <View className="bg-white px-5 py-4 rounded-md">
            <Text className="text-lg font-bold mb-2">
              Clear Saved Bus Stops
            </Text>
            <Text numberOfLines={2} className="mb-4">
              Are you sure you want to clear the data?
            </Text>
            <View className="flex-row justify-between px-1">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setModalVisible(false)}
                className="bg-gray-300 p-2 rounded-md"
              >
                <Text className="font-bold px-6">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={clearSavedBusStops}
                className="bg-blue-500 p-2 rounded-md"
              >
                <Text className="text-white font-bold px-6">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsScreen;
