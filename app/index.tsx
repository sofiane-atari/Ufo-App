import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

interface UfoSighting {
  id: number;
  witnessName: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
  status: string;
  dateTime: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    textAlign: 'right',
    color: '#007BFF',
    backgroundColor: '#ff6347',
    height: 40,
    width: 65,
    padding: 10,
    borderRadius: 20
  },
});

export default function Index() {
  const [sightings, setSightings] = useState<UfoSighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSighting, setSelectedSighting] = useState<UfoSighting | null>(null);

  const fetchSightings = async () => {
    try {
      const response = await axios.get('https://sampleapis.assimilate.be/ufo/sightings');
      const data: UfoSighting[] = response.data;
      setSightings(data);
      setLoading(false);
    } catch (error) {
      console.error('Fout bij het ophalen van UFO-zichtingen:', error);
      setError('Er is iets misgegaan bij het laden van de zichtingen.');
      setLoading(false);
    }
  };

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
            onPress={() => setSelectedSighting(sighting)} // Open modal bij klik
          />
        ))}
      </MapView>

      {/* Modal voor details */}
      <Modal visible={!!selectedSighting} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Details:</Text>
            <Text>Getuige: {selectedSighting?.witnessName}</Text>
            <Text>Beschrijving: {selectedSighting?.description}</Text>
            <Text>Status: {selectedSighting?.status}</Text>
            <Text>Datum: {selectedSighting?.dateTime}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedSighting(null)} // Sluit modal
            >
              <Text>Sluiten</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}