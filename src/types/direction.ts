export interface LocalLocation {
  latitude: number;
  longitude: number;
}

export type RoutingProfile = 'pedestrian' | 'cyclability';

interface RoutingData {
  locations: LocalLocation[];
  duration: number;
  distance: number;
  routingProfile: RoutingProfile;
}

export interface PostDirectionResponse {
  getDirectionsResponses: RoutingData[];
}

export interface PostWalkDirectionResponse extends RoutingData {
  routingProfile: 'pedestrian';
}

export type pointType = 'start' | 'end';
export interface MoveToLocationParam {
  latitude: number;
  longitude: number;
  type: 'station' | pointType;
}
