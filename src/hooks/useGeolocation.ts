import { useAtom } from 'jotai';
import { useCallback } from 'react';

import { START } from '@/constants';
import { locationAtom } from '@/store/atom';

import { useKakaoMap } from './useKakaoMap';

export function useGeolocation() {
  const [location, setLocation] = useAtom(locationAtom);
  const { changeAddress } = useKakaoMap();

  const initPosition = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          ...location,
          startLatitude: latitude,
          startLongitude: longitude,
        });
        changeAddress(latitude, longitude, START);
      });
    } else {
      alert('현위치를 알 수 없습니다.');
    }
  }, [changeAddress, location, setLocation]);

  return { initPosition };
}
