import { getFetch } from './common';

export const getAllStation = () => {
  return getFetch('/station/realtime') as Promise<StationResponse>;
};
