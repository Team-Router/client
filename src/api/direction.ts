import type {
  PostDirectionResponse,
  PostWalkDirectionResponse,
} from '@/types/direction';

import { postFetch } from './common';

interface PostDirectionParam {
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
}

export const getDirectionBySelectedLocation = ({
  startLatitude,
  startLongitude,
  endLatitude,
  endLongitude,
}: PostDirectionParam) => {
  return postFetch('/route/cycle', {
    startLocation: {
      latitude: startLatitude,
      longitude: startLongitude,
    },
    endLocation: {
      latitude: endLatitude,
      longitude: endLongitude,
    },
  }) as Promise<PostDirectionResponse>;
};

export const getWalkDirectionBySelectedLocation = ({
  startLatitude,
  startLongitude,
  endLatitude,
  endLongitude,
}: PostDirectionParam) => {
  return postFetch('/route/walk', {
    startLocation: {
      latitude: startLatitude,
      longitude: startLongitude,
    },
    endLocation: {
      latitude: endLatitude,
      longitude: endLongitude,
    },
  }) as Promise<PostWalkDirectionResponse>;
};
