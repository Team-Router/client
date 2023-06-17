import { useAtom } from 'jotai';
import { useCallback } from 'react';

import { locationAtom } from '@/store/atom';

import { useKakaoMap } from './useKakaoMap';

export function useGeolocation() {
  const [location, setLocation] = useAtom(locationAtom);
  const { changeAddress } = useKakaoMap();

  const initPosition = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          ...location,
          startLatitude: position.coords.latitude,
          startLongitude: position.coords.longitude,
        });
        changeAddress(
          position.coords.latitude,
          position.coords.longitude,
          'start'
        );
      });
    } else {
      alert('현위치를 알 수 없습니다.');
    }
  }, [changeAddress, location, setLocation]);

  return { initPosition };
}
