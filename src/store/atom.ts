import { atom } from 'jotai';

export const mapAtom = atom<kakao.maps.Map | null>(null);

export const addressAtom = atom<{ start: string; end: string }>({
  start: '',
  end: '',
});
