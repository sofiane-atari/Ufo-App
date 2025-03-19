import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import styles from "@/assets/itemStyles/styles";
import { UfoSighting } from "@/types";
import { useNavigation } from "expo-router";

// Definieer de types voor je navigatie-stack
type RootStackParamList = {
  SightingDetail: { sighting: UfoSighting };
};

type SightingDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "SightingDetail"
>;

interface SightingDetailScreenProps {
  route: SightingDetailScreenRouteProp;
}

const SightingDetailScreen: React.FC<SightingDetailScreenProps> = ({
  route,
}) => {
  const { sighting } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.sightingItem}>
      <Text style={styles.title}>{sighting.witnessName}</Text>
      <Text style={styles.description}>{sighting.description}</Text>
      <View style={styles.imageContainer}>
        <Image source={{ uri: sighting.picture }} style={styles.image} />
      </View>
      <Text style={styles.date}>Datum: {sighting.dateTime}</Text>
      <Text style={styles.date}>Status: {sighting.status}</Text>
      <Text style={styles.contact}>Contact: {sighting.witnessContact}</Text>

      <TouchableOpacity
        style={styles.button} // Stijl voor de knop
        onPress={() => navigation.goBack()} // Navigatie-actie
      >
        <Text style={styles.buttonText}>Back to Sightings List</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SightingDetailScreen;
