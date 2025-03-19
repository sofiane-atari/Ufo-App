import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Sightings from "./sightings";
import SightingDetailScreen from "./sightingDetailScreen";
import { RootStackParamList } from "@/types"; // Importeer de types
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Stack = createStackNavigator<RootStackParamList>();

const SightingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SightingsList"
        component={Sightings}
        options={{
          title: "Sighting Details",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SightingDetail"
        component={SightingDetailScreen}
        options={{ title: "Sighting Details", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default SightingsStack;
