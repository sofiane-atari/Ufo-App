import { Stack } from "expo-router";
import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "lightgreen" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="alien" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="sightingsStack"
        options={{
          title: "Sightings",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="eye" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
