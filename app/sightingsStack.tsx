import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Sightings from "./sightings";
import SightingDetailScreen from "./sightingDetailScreen";
import { RootStackParamList } from "@/types"; // Importeer de types

const Stack = createStackNavigator<RootStackParamList>();

const SightingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SightingsList" component={Sightings} />
      <Stack.Screen name="SightingDetail" component={SightingDetailScreen} />
    </Stack.Navigator>
  );
};

export default SightingsStack;
