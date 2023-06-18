import { PostDirectionResponse } from '@/types/direction';

import { postFetch } from './common';

interface PostDirectionParam {
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
}

export const getDirectionBySelectedLocation = (param: PostDirectionParam) => {
  return postFetch('/route/cycle', param) as Promise<PostDirectionResponse>;
};
