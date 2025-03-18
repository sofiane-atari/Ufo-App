import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { RouteProp } from "@react-navigation/native";
import styles from "@/assets/itemStyles/styles";
import { UfoSighting } from "@/types";

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
    </View>
  );
};

export default SightingDetailScreen;
