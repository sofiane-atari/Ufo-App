export interface UfoSighting {
  id: number;
  witnessName: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
  picture: string;
  status: "confirmed" | "unconfirmed";
  dateTime: string;
  witnessContact: string;
}

export type RootStackParamList = {
  SightingsList: undefined; // Geen parameters voor de lijstpagina
  SightingDetail: { sighting: UfoSighting }; // Parameters voor de detailpagina
};
