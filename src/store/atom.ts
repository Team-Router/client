import { atom } from 'jotai';

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
