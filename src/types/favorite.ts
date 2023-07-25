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
