interface Location {
  latitude: number;
  longitude: number;
}

export type RoutingProfile = 'pedestrian' | 'cyclability';

interface RoutingData {
  locations: Location[];
  duration: number;
  distance: number;
  routingProfile: RoutingProfile;
}

export interface PostDirectionResponse {
  state: number;
  result: 'success';
  message: null;
  data: RoutingData[];
  error: [];
}
