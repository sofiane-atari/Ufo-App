"use dom";
import React, { useState, useEffect, useRef } from "react";
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
  Platform,
  Alert,
} from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  Camera,
} from "expo-camera";
import { Image } from "expo-image";
import DateTimePicker from "react-datetime-picker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UfoSighting, LatLng, FormData } from "@/types";
import styles from "@/assets/itemStyles/indexStyles";

const iconX = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/similonap/public_icons/refs/heads/main/location-pin.png",
  iconSize: [48, 48],
  popupAnchor: [-3, 0],
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0"); // Declareer `day` één keer
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Maanden zijn 0-geïndexeerd
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const LocationHandler = ({
  addMarker,
  setTempMarker,
}: {
  addMarker: (lat: number, lng: number) => void;
  setTempMarker: (latLng: LatLng) => void;
}) => {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      addMarker(lat, lng); // Voeg de marker toe aan het formulier
      setTempMarker({ lat, lng }); // Update de tijdelijke marker
    },
  });
  return null;
};

export default function Index() {
  const [sightings, setSightings] = useState<UfoSighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    witnessName: "",
    description: "",
    dateTime: "",
    selectedLatLng: null,
    witnessContact: "",
  });
  const [tempMarker, setTempMarker] = useState<LatLng | null>(null);

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
    const {
      witnessName,
      description,
      dateTime,
      selectedLatLng,
      witnessContact,
    } = formData;

    if (
      !witnessName ||
      !description ||
      !dateTime ||
      !selectedLatLng ||
      !witnessContact
    ) {
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
      witnessContact: formData.witnessContact,
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
      witnessContact: "",
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
          addMarker={(lat, lng) =>
            setFormData({ ...formData, selectedLatLng: { lat, lng } })
          }
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
            </Popup>
          </Marker>
        ))}
        {tempMarker && (
          <Marker position={[tempMarker.lat, tempMarker.lng]} icon={iconX} />
        )}
      </MapContainer>

      <Form
        formData={formData}
        setFormData={setFormData}
        handleAddSighting={handleAddSighting}
      />
    </View>
  );
}

interface FormProps {
  formData: FormData;
  setFormData: (formData: FormData) => void;
  handleAddSighting: () => void;
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
          <DatePicker
            selected={formData.dateTime ? new Date(formData.dateTime) : null}
            onChange={(date) =>
              setFormData({
                ...formData,
                dateTime: date ? date.toISOString() : "",
              })
            }
            dateFormat="dd-MM-yyyy"
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Text style={styles.label}>Contactgegevens:</Text>
          <TextInput
            value={formData.witnessContact}
            onChangeText={(text) =>
              setFormData({ ...formData, witnessContact: text })
            }
            multiline
            style={styles.textarea}
          />
          <Button title="Sighting toevoegen" onPress={handleAddSighting} />
          <Text style={styles.warning}>
            Klik eerst op de gewenste locatie voordat je op toevoegen klikt!
          </Text>
          {
            <CameraComponent></CameraComponent>
          }
        </View>
      )}
    </>
  );
};
const CameraComponent = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  if (!permission) {
    return null;
  }
  if (!permission.granted) {
    return (
      <View style={styles.buttonContainer}>
        <Text style={styles.message}>geef ons toegang tot je camera</Text>
        <Button
          title="Toegang geven"
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
          }}
        />
      </View>
    );
  }
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  const takePicture = async () => {
    console.log(ref.current)
    if (ref.current) {
      try {
        const photo = await ref.current.takePictureAsync();
        console.log(photo?.uri)
        if (photo) {
          setUri(photo.uri);
        } else {
          Alert.alert(
            "Fout",
            "Er is een fout opgetreden bij het maken van de foto."
          );
        }
      }
      catch (error) {
        console.error("Fout bij het maken van de foto:", error);
        Alert.alert(
          "Fout",
          "Er is een fout opgetreden bij het maken van de foto."
        )
      }
  };
}
  const renderCamera = () => {
    return (
      <CameraView style={styles.camera} ref={ref}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.label}>Snap</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    );
  };
  const renderPicture = () => {
    return (
      <View>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={{ width: 300, aspectRatio: 1 }}
        />
        <Button onPress={() => setUri(null)} title="Neem een andere foto" />
      </View>
    );
  };
  return (
    <View style={styles.cameracontainer}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  );
};
