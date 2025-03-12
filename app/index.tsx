import React, { useState, useEffect } from 'react';
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L from "leaflet";
import axios from 'axios';
import { View, StyleSheet, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

interface LatLng {
  lat: number;
  lng: number;
}

interface FormData {
  witnessName: string;
  description: string;
  dateTime: string;
  selectedLatLng: LatLng | null;
}

const iconX = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/similonap/public_icons/refs/heads/main/location-pin.png',
  iconSize: [48, 48],
  popupAnchor: [-3, 0],
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const LocationHandler = ({ addMarker, setTempMarker }: { 
  addMarker: (lat: number, lng: number) => void; 
  setTempMarker: (latLng: LatLng) => void; 
}) => {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      addMarker(lat, lng); // Voeg de marker toe aan het formulier
      setTempMarker({ lat, lng }); // Update de tijdelijke marker
    }
  });
  return null;
};

export default function Index() {
  const [sightings, setSightings] = useState<UfoSighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    witnessName: '',
    description: '',
    dateTime: '',
    selectedLatLng: null,
  });
  const [tempMarker, setTempMarker] = useState<LatLng | null>(null);

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

  const handleAddSighting = () => {
    const { witnessName, description, dateTime, selectedLatLng } = formData;

    if (!witnessName || !description || !dateTime || !selectedLatLng) {
      alert('Vul alle velden in en selecteer een locatie.');
      return;
    }

    const newSighting: UfoSighting = {
      id: Math.random(),
      witnessName,
      location: {
        latitude: selectedLatLng.lat,
        longitude: selectedLatLng.lng,
      },
      description,
      status: 'unconfirmed',
      dateTime,
    };

    setSightings([...sightings, newSighting]);
    setFormData({
      witnessName: '',
      description: '',
      dateTime: '',
      selectedLatLng: null,
    });
    setTempMarker(null); // Verwijder de tijdelijke marker na toevoegen
  };

  if (loading) {
    return <div>Bezig met laden...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <View style={styles.container}>
      <MapContainer
        center={{ lat: 51.21989, lng: 4.40346 }}
        zoom={13}
        scrollWheelZoom={false}
        style={styles.map}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationHandler
          addMarker={(lat, lng) => setFormData({ ...formData, selectedLatLng: { lat, lng } })}
          setTempMarker={(latLng) => setTempMarker(latLng)} // Voeg setTempMarker toe
        />
        {sightings.map((sighting, index) => (
          <Marker
            key={index}
            position={[sighting.location.latitude, sighting.location.longitude]}
            icon={iconX}
          >
            <Popup>
              <div>
                <p><strong>Getuigen:</strong> {sighting.witnessName}</p>
                <p><strong>Beschrijving:</strong> {sighting.description}</p>
                <p><strong>Datum:</strong> {formatDate(sighting.dateTime)}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        {tempMarker && (
          <Marker
            position={[tempMarker.lat, tempMarker.lng]}
            icon={iconX}
          />
        )}
      </MapContainer>

      <Form formData={formData} setFormData={setFormData} handleAddSighting={handleAddSighting} />
    </View>
  );
}

interface FormProps {
  formData: FormData,
  setFormData: (formData: FormData) => void,
  handleAddSighting: () => void
}

const Form = ({ formData, setFormData, handleAddSighting }: FormProps) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  return (
    <>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsFormVisible(!isFormVisible)}
      >
        {isFormVisible ? <ChevronLeft size={25} /> : <ChevronRight size={25} />}
      </TouchableOpacity>

      {isFormVisible && (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Getuige naam:</Text>
          <TextInput
            value={formData.witnessName}
            onChangeText={(text) => setFormData({ ...formData, witnessName: text })}
            style={styles.input}
          />
          <Text style={styles.label}>Beschrijving:</Text>
          <TextInput
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            style={styles.textarea}
          />
          <Text style={styles.label}>Datum:</Text>
          <TextInput
            value={formData.dateTime}
            onChangeText={(text) => setFormData({ ...formData, dateTime: text })}
            style={styles.input}
          />
          <Button title="Sighting toevoegen" onPress={handleAddSighting} />
          <Text style={styles.warning}>Klik eerst op de gewenste locatie voordat je op toevoegen klikt!</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  map: {
    flex: 1,
  },
  formContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    zIndex: 1000,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  toggleButton: {
    position: 'absolute',
    left: 10,
    bottom: '50%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1010,
  },
  warning: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'red',
  },
});