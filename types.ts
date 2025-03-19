export interface UfoSighting {
  id: number;
  witnessName: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
  picture?: string;
  status: string;
  dateTime: string;
  witnessContact: string;
}

export type RootStackParamList = {
  SightingsList: undefined; // Geen parameters voor de lijstpagina
  SightingDetail: { sighting: UfoSighting }; // Parameters voor de detailpagina
};

export interface LatLng {
  lat: number;
  lng: number;
}

export interface FormData {
  witnessName: string;
  description: string;
  dateTime: string;
  selectedLatLng: LatLng | null;
  witnessContact: string;
}
