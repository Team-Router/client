import { useCallback, useState } from 'react';

export function useGeolocation() {
  const [lat, setLat] = useState(33.450701);
  const [lon, setLon] = useState(126.570667);

  const initPosition = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      });
    } else {
      console.log('geolocation을 사용할수 없어요..');
      alert('geolocation을 사용할수 없어요..');
    }
  }, []);

  return { lat, lon, initPosition };
}
