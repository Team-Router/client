interface StationData {
  stationName: string;
  parkingBikeTotCnt: number;
  stationLatitude: number;
  stationLongitude: number;
  stationId: string;
}

interface StationResponse {
  count: number;
  data: StationData[];
}

interface StationParam {
  latitude: number;
  longitude: number;
}
