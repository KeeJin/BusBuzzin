import React from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConfirmationModal from "../components/ConfirmationModal";
import SettingsCard from "../components/ui/SettingsCard";
import { removeAllBusAlertSettings } from "../utils/BusAlerts";


const SettingsScreen: React.FC = () => {
  const [clearBusStopsModalVisible, setClearBusStopsModalVisible] = React.useState(false);
  const [clearBusAlertsModalVisible, setClearBusAlertsModalVisible] = React.useState(false);
  
  const clearSavedBusStops = async () => {
    try {
      await AsyncStorage.removeItem("savedBusStops");
    } catch (e) {
      console.error(e);
    }
    setClearBusStopsModalVisible(false);
    alert("Cleared saved bus stops.");
  };

  const clearBusAlerts = async () => {
    try {
      await removeAllBusAlertSettings();
    } catch (e) {
      console.error(e);
    }
    setClearBusAlertsModalVisible(false);
    alert("Cleared bus alerts.");
  }

  return (
    <View className="bg-slate-800 flex h-full px-6 py-10">
      <Text className="text-white text-3xl text-left pl-2 mt-7 mb-3">Settings</Text>
      <SettingsCard title="Clear Saved Bus Stops" onPress={() => {
          setClearBusStopsModalVisible(true);
        }} />
      <SettingsCard title="Clear Bus Alerts" onPress={() => {
          setClearBusAlertsModalVisible(true);
        }} />
      
      <ConfirmationModal
        visible={clearBusStopsModalVisible}
        title="Clear Saved Bus Stops"
        message="Are you sure you want to clear the data?"
        onConfirm={clearSavedBusStops}
        onCancel={() => setClearBusStopsModalVisible(false)}
      />
      <ConfirmationModal
        visible={clearBusAlertsModalVisible}
        title="Clear Bus Alerts"
        message="Are you sure you want to clear all bus alerts?"
        onConfirm={clearBusAlerts}
        onCancel={() => setClearBusAlertsModalVisible(false)}
      />
    </View>
  );
};

export default SettingsScreen;
