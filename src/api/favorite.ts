import type { PlaceInfoResponse, StationInfoResponse } from '@/types/favorite';

import { deleteFetch, getFetch, postFetch } from './common';

interface PlaceParam {
  name: string;
  longitude: number;
  latitude: number;
}

export const getFavoriteAllStation = (token: string) => {
  return getFetch('/favorite', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }) as Promise<StationInfoResponse>;
};

export const addFavoriteStation = (stationId: string, token: string) => {
  return postFetch(
    `/favorite?stationId=${stationId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteFavoriteStation = (stationId: string, token: string) => {
  return deleteFetch(`/favorite?stationId=${stationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllFavoritePlace = (token: string) => {
  return getFetch('/place', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }) as Promise<PlaceInfoResponse>;
};

export const addFavoritePlace = (
  { name, longitude, latitude }: PlaceParam,
  token: string
) => {
  return postFetch(
    `/place`,
    { name, longitude, latitude },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteFavoritePlace = (favoriteId: number, token: string) => {
  return deleteFetch(`/place?favoriteId=${favoriteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
