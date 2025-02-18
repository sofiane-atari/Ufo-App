export interface UfoSighting {
    id: number;
    witnessName: string;
    location: {
      latitude: number;
      longitude: number;
    };
    description: string;
    picture: string;
    status: 'confirmed' | 'unconfirmed';
    dateTime: string;
    witnessContact: string;
}