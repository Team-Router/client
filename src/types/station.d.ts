interface StationData {
  name: string;
  count: number;
  latitude: number;
  longitude: number;
  id: string;
}

interface StationResponse {
  count: number;
  stationRealtimeResponses: StationData[];
}

interface StationParam {
  latitude: number;
  longitude: number;
}

interface FavoriteStationResponse extends StationResponse {
  favoriteStationResponses: StationData[];
}
