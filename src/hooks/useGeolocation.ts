import { useCallback, useState } from 'react';

import { useKakaoMap } from './useKakaoMap';

export function useGeolocation() {
  const [lat, setLat] = useState(33.450701);
  const [lon, setLon] = useState(126.570667);
  const { changeAddress } = useKakaoMap();

  const initPosition = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
        changeAddress(
          position.coords.latitude,
          position.coords.longitude,
          'start'
        );
      });
    } else {
      console.log('geolocation을 사용할수 없어요..');
      alert('geolocation을 사용할수 없어요..');
    }
  }, [changeAddress]);

  return { lat, lon, initPosition };
}
