import { PEDESTRIAN, CYCLABILITY } from '../constants';

interface Location {
  latitude: number;
  longitude: number;
}

type RoutingProfile = PEDESTRIAN | CYCLABILITY;

interface RoutingData extends RoutingProfile {
  locations: Location[];
  duration: number;
  distance: number;
}

export interface PostDirectionResponse {
  state: number;
  result: 'success';
  message: null;
  data: RoutingData[];
  error: [];
}
