import {
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { UfoSighting } from "@/types";
import styles from "../assets/itemStyles/styles";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types";

export default function Sightings() {
  const [sightings, setSightings] = useState<UfoSighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const fetchSightings = async () => {
    try {
      const storedData = await AsyncStorage.getItem("ufoSightings");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setSightings(parsedData);
      } else {
        // If no data in storage, fetch from API
        await fetchSightingsFromAPI();
      }
      console.log("Opgeslagen data:", JSON.stringify(storedData, null, 2));
    } catch (error) {
      console.error("Error loading sightings from storage:", error);
      setError("Er is iets misgegaan bij het laden van de zichtingen.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchSightingsFromAPI = async () => {
    try {
      const response = await axios.get(
        "https://sampleapis.assimilate.be/ufo/sightings"
      );
      const data: UfoSighting[] = response.data;

      // Store fetched data in AsyncStorage
      await AsyncStorage.setItem("ufoSightings", JSON.stringify(data));

      setSightings(data);
    } catch (error) {
      console.error("Error fetching sightings from API:", error);
      setError("Er is iets misgegaan bij het laden van de zichtingen.");
    }
  };

  // Refresh function
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSightings();
  }, []);

  // effect for initial load
  useEffect(() => {
    fetchSightings();
  }, []);

  // When navigating to this screen
  useFocusEffect(
    useCallback(() => {
      fetchSightings();
      return () => {};
    }, [])
  );

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="lightgreen"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
  }

  if (error) {
    return (
      <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>
        {error}
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sightings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SightingDetail", { sighting: item })
            }
          >
            <View style={styles.sightingItem}>
              <Text style={styles.title}>{item.witnessName}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.picture }} style={styles.image} />
              </View>
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["lightgreen"]}
          />
        }
      />
    </View>
  );
}
