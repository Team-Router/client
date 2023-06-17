interface Location {
  latitude: number;
  longitude: number;
}

export interface PostDirectionResponse {
  state: number;
  result: 'success';
  message: null;
  data: [
    {
      routingProfile: pedestrian;
      locations: Location[];
      duration: number;
      distance: number;
    },
    {
      routingProfile: cyclability;
      locations: Location[];
      duration: number;
      distance: number;
    },
    {
      routingProfile: pedestrian;
      locations: Location[];
      duration: number;
      distance: number;
    }
  ];
  error: [];
}
