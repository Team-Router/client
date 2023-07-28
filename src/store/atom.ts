import { atom } from 'jotai';

import { ROUTES } from '@/constants';

export const mapAtom = atom<kakao.maps.Map | null>(null);

export const addressAtom = atom<{ start: string; end: string }>({
  start: '',
  end: '',
});

export const locationAtom = atom<{
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
}>({
  startLatitude: 33.450701,
  startLongitude: 126.570667,
  endLatitude: 33.450701,
  endLongitude: 126.570667,
});

export const pageTabAtom = atom<string>(ROUTES);

export const startMarkerAtom = atom<kakao.maps.Marker | null>(null);
export const endMarkerAtom = atom<kakao.maps.Marker | null>(null);
