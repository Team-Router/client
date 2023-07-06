interface StationData {
  stationName: string;
  parkingBikeTotCnt: number;
  stationLatitude: number;
  stationLongitude: number;
  stationId: string;
}

interface StationResponse {
  state: 200;
  result: 'success';
  message: null;
  data: StationData[];
  error: [];
}
