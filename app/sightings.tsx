import { Text, View, Image, FlatList, ActivityIndicator } from "react-native";
import { UfoSighting } from "@/types";
import styles from "../assets/itemStyles/styles";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Sightings() {
  const [sightings, setSightings] = useState<UfoSighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSightings = async () => {
    try {
      const response = await axios.get(
        "https://sampleapis.assimilate.be/ufo/sightings"
      );
      const data: UfoSighting[] = response.data;
      setSightings(data);
      setLoading(false);
    } catch (error) {
      console.error("Fout bij het ophalen van UFO-zichtingen:", error);
      setError("Er is iets misgegaan bij het laden van de zichtingen.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSightings();
  }, []);

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
          <View style={styles.sightingItem}>
            <Text style={styles.title}>{item.witnessName}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Image source={{ uri: item.picture }} style={styles.image} />
            <Text style={styles.date}>Datum: {item.dateTime}</Text>
            <Text style={styles.date}>Status: {item.status}</Text>
            <Text style={styles.contact}>Contact: {item.witnessContact}</Text>
          </View>
        )}
      />
    </View>
  );
}
