'use client';

import React, { useEffect, useState } from 'react';

import { displayMarker } from '@/utils/displayMarker';

export default function KaKaoMap() {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const $script = document.createElement('script');
    $script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&autoload=false&libraries=services`;
    $script.addEventListener('load', () => setMapLoaded(true));
    document.head.appendChild($script);
  }, []);

  useEffect(() => {
    if (!mapLoaded) return;

    kakao.maps.load(() => {
      const container = document.getElementById('map') as HTMLElement;
      const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };

      const map = new kakao.maps.Map(container, options);
      const geocoder = new kakao.maps.services.Geocoder();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const locPosition = new kakao.maps.LatLng(lat, lon);
          const message = '<div styled="padding:5px">출발</div>';

          displayMarker(map, locPosition, message);

          const callback = (
            result: { [key: string]: any },
            status: kakao.maps.services.Status
          ) => {
            if (status === kakao.maps.services.Status.OK) {
              console.log(result[0].address.address_name);
            } else {
              console.log('현재 위치의 주소를 가져올 수 없습니다.');
            }
          };

          geocoder.coord2Address(
            locPosition.getLng(),
            locPosition.getLat(),
            callback
          );
        });
      } else {
        const locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
          message = 'geolocation을 사용할수 없어요..';

        displayMarker(map, locPosition, message);
      }
    });
  }, [mapLoaded]);

  return <div id="map" style={{ width: '500px', height: '400px' }}></div>;
}
