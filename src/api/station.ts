import type { StationParam, StationResponse } from '@/types/station';

import { postFetch } from './common';

export const getRealTimeStation = (mapCenterLocation: StationParam) => {
  return postFetch(
    '/station/realtime',
    mapCenterLocation
  ) as Promise<StationResponse>;
};
