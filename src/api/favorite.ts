import { FavoriteStationResponse } from '@/types/station';

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
  }) as Promise<FavoriteStationResponse>;
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

export const getAllFavoritePlace = () => {
  return getFetch('/place');
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

export const deleteFavoritePlace = (favoriteId: string, token: string) => {
  return deleteFetch(`/place?favoriteId=${favoriteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
