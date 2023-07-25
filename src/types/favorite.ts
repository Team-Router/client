export interface StationInfoResponse {
  count: string;
  favoriteStationResponses: Station[];
}

export interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: Promise<string>;
}

export interface PlaceInfoResponse {
  count: string;
  favoritePlaces: Place[];
}

export interface Place {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: Promise<string>;
}
