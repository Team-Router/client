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

  const getAddress = (lat: number, lon: number) => {
    const geocoder = new kakao.maps.services.Geocoder();
    const callback = (
      result: { [key: string]: any },
      status: kakao.maps.services.Status
    ) => {
      if (status === kakao.maps.services.Status.OK) {
        return result[0].address.address_name;
      } else {
        alert('현재 위치의 주소를 가져올 수 없습니다.');
      }
    };

    geocoder.coord2Address(lat, lon, callback);
  };

  return { lat, lon, initPosition, getAddress };
}
