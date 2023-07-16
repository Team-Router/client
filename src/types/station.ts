interface StationData {
  name: string;
  count: number;
  latitude: number;
  longitude: number;
  id: string;
}

export interface StationParam {
  latitude: number;
  longitude: number;
}

export interface StationResponse {
  count: number;
  stationRealtimeResponses: StationData[];
}

export interface FavoriteStationResponse extends StationResponse {
  favoriteStationResponses: StationData[];
}
