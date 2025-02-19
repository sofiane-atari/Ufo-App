"use dom"

import React, { useState, useEffect } from 'react';
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L from "leaflet";
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

const iconX = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/similonap/public_icons/refs/heads/main/location-pin.png',
  iconSize: [48, 48],
  popupAnchor: [-3, 0],
});

const LocationHandler = ({ addMarker }: { addMarker: (lat: number, lng: number) => void }) => {
  const map = useMapEvents({
    click: (e) => {
      addMarker(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

export default function Index() {
  const [sightings, setSightings] = useState<UfoSighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return <div>Bezig met laden...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const addSighting = (lat: number, lng: number) => {
    setSightings([
      ...sightings,
      {
        id: Math.random(),
        witnessName: "Gebruiker",
        description: "Kies maar",
        location: { latitude: lat, longitude: lng },
        status: "unconfirmed",
        dateTime: "1/11/2011"
      }
    ]);
  };

  return (
    <MapContainer
      center={{ lat: 51.505, lng: -0.09 }}
      zoom={13}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '100vh' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationHandler addMarker={addSighting} />
      {sightings.map((sighting, index) => (
        <Marker
          key={index}
          position={[sighting.location.latitude, sighting.location.longitude]}
          icon={iconX}
        >
          <Popup>
            <div>
              <p>{sighting.witnessName}</p>
              <p>{sighting.description}</p>
              <p>{sighting.dateTime}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}