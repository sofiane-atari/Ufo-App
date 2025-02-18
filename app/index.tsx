import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import MapView, { Callout, Marker } from 'react-native-maps'
import {UfoSighting} from '../types'
import axios from 'axios'


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  calloutContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  calloutDate: {
    fontSize: 12,
    color: '#666',
  },
});
export default function Index() {
  const [sightings, setSightings] = useState<UfoSighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Functie om data op te halen van de API
  const fetchSightings = async () => {
    try {
      const response = await axios.get('https://sampleapis.assimilate.be/ufo/sightings'); // Vervang door het echte API-eindpunt
      const data: UfoSighting[] = response.data;
      setSightings(data);
      setLoading(false);
    } catch (error) {
      console.error('Fout bij het ophalen van UFO-zichtingen:', error);
      setError('Er is iets misgegaan bij het laden van de zichtingen.');
      setLoading(false);
    }
  };

  // Roept de fetch-functie aan bij het laden van de component
  useEffect(() => {
    fetchSightings();
  }, []);

  if (loading) {
    return <Text>Bezig met laden...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }
  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
      {sightings.map((sighting) => (
          <Marker
            key={sighting.id}
            coordinate={sighting.location}
            title={`Getuige: ${sighting.witnessName}`}
            description={sighting.description}
          >
            {/* Callout voor extra informatie */}
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>Status: {sighting.status}</Text>
                <Text style={styles.calloutDescription}>{sighting.description}</Text>
                <Text style={styles.calloutDate}>Datum: {new Date(sighting.dateTime).toLocaleDateString()}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}