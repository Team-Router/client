import { FavoriteStationResponse } from '@/types/station';

import { getFetch } from './common';

export const getFavoriteAllStation = () => {
  return getFetch('/favorite') as Promise<FavoriteStationResponse>;
};