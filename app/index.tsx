"use dom";

import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Interface voor formulierdata
interface FormData {
  witnessName: string;
  description: string;
  dateTime: string;
  selectedLatLng: LatLng | null; // Kan een LatLng-object of null zijn
}

const iconX = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/similonap/public_icons/refs/heads/main/location-pin.png",
  iconSize: [48, 48],
  popupAnchor: [-3, 0],
});

// Functie om de datum te formateren
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Maanden zijn 0-geïndexeerd
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Locatie selectie handler
const LocationHandler = ({
  addMarker,
}: {
  addMarker: (lat: number, lng: number) => void;
}) => {
  const map = useMapEvents({
    click: (e) => {
      addMarker(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export default function Index() {
  const [sightings, setSightings] = useState<UfoSighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  // Formulierstatus
  const [formData, setFormData] = useState<FormData>({
    witnessName: "",
    description: "",
    dateTime: "",
    selectedLatLng: null,
  });

  // Gegevens ophalen
  /*
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
  };*/

  const fetchSightings = async () => {
    try {
      // Check if data exists in AsyncStorage first
      const storedData = await AsyncStorage.getItem("ufoSightings");

      if (storedData) {
        // If data exists in storage, use it
        const parsedData = JSON.parse(storedData);
        setSightings(parsedData);
        setLoading(false);
      } else {
        // If no data in storage, fetch from API
        const response = await axios.get(
          "https://sampleapis.assimilate.be/ufo/sightings"
        );
        const data: UfoSighting[] = response.data;

        // Store fetched data in AsyncStorage
        await AsyncStorage.setItem("ufoSightings", JSON.stringify(data));

        setSightings(data);
        setLoading(false);
      }
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
    return <div>Bezig met laden...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Sighting toevoegen
  const handleAddSighting = async () => {
    const { witnessName, description, dateTime, selectedLatLng } = formData;

    if (!witnessName || !description || !dateTime || !selectedLatLng) {
      alert("Vul alle velden in en selecteer een locatie.");
      return;
    }

    const newSighting: UfoSighting = {
      id: Date.now(), // Gebruik liever een UUID of timestamp voor unieke ID's
      witnessName: formData.witnessName,
      location: {
        latitude: selectedLatLng.lat,
        longitude: selectedLatLng.lng,
      },
      description: formData.description,
      status: "unconfirmed",
      dateTime: formData.dateTime,
    };

    // Controleer of de sighting al bestaat
    const updatedSightings = [...sightings];
    if (!updatedSightings.some((s) => s.id === newSighting.id)) {
      updatedSightings.push(newSighting);
    }

    // Update de state en sla op in AsyncStorage
    setSightings(updatedSightings);
    await AsyncStorage.setItem(
      "ufoSightings",
      JSON.stringify(updatedSightings)
    );

    console.log("Opgeslagen data:", JSON.stringify(updatedSightings, null, 2));
    setFormData({
      witnessName: "",
      description: "",
      dateTime: "",
      selectedLatLng: null,
    });
  };

  return (
    <View style={styles.container}>
      {/* Kaart */}
      <MapContainer
        center={{ lat: 51.21989, lng: 4.40346 }}
        zoom={13}
        scrollWheelZoom={false}
        style={styles.map}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationHandler
          addMarker={(lat, lng) =>
            setFormData({ ...formData, selectedLatLng: { lat, lng } })
          }
        />
        {sightings.map((sighting, index) => (
          <Marker
            key={index}
            position={[sighting.location.latitude, sighting.location.longitude]}
            icon={iconX}
          >
            <Popup>
              <div>
                <p>
                  <strong>Getuigen:</strong> {sighting.witnessName}
                </p>
                <p>
                  <strong>Beschrijving:</strong> {sighting.description}
                </p>
                <p>
                  <strong>Datum:</strong> {formatDate(sighting.dateTime)}
                </p>
              </div>
              <Button title="See details"></Button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Formulier */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsFormVisible(!isFormVisible)}
      >
        {isFormVisible ? <ChevronLeft size={25} /> : <ChevronRight size={25} />}
      </TouchableOpacity>

      {/* Formulier */}
      {isFormVisible && (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Getuige naam:</Text>
          <TextInput
            value={formData.witnessName}
            onChangeText={(text) =>
              setFormData({ ...formData, witnessName: text })
            }
            style={styles.input}
          />
          <Text style={styles.label}>Beschrijving:</Text>
          <TextInput
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            multiline
            style={styles.textarea}
          />
          <Text style={styles.label}>Datum:</Text>
          <TextInput
            value={formData.dateTime}
            onChangeText={(text) =>
              setFormData({ ...formData, dateTime: text })
            }
            style={styles.input}
          />
          <Button title="Sighting toevoegen" onPress={handleAddSighting} />
        </View>
      )}
    </View>
  );
}

// Stijlen
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  map: {
    flex: 1,
  },
  formContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#ffffff", // Witte achtergrond
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    zIndex: 1000,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    color: "#000", // Tekstkleur
    backgroundColor: "#f9f9f9",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    height: 80,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#ff6347",
    color: "black",
  },
  toggleButton: {
    position: "absolute",
    left: 10,
    bottom: "50%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1010,
  },
});
