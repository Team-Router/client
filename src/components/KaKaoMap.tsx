'use client';

import { useAtom } from 'jotai';
import React, { useEffect } from 'react';

import { useGeolocation } from '@/hooks/useGeolocation';
import { useKakaoMap } from '@/hooks/useKakaoMap';
import { mapAtom } from '@/store/atom';

interface KaKaoMapProps {
  setStartPoint: React.Dispatch<React.SetStateAction<string>>;
}

export default function KaKaoMap({ setStartPoint }: KaKaoMapProps) {
  const [map, setMap] = useAtom(mapAtom);

  const { displayMarker, displayInfoWindow } = useKakaoMap();
  const { lat, lon, initPosition } = useGeolocation();

  useEffect(() => {
    kakao.maps.load(() => {
      const container = document.getElementById('map') as HTMLElement;
      initPosition();
      const options = {
        center: new kakao.maps.LatLng(lat, lon),
        level: 3,
      };
      setMap(new kakao.maps.Map(container, options));
    });
  }, [lat, lon, setMap, initPosition]);

  useEffect(() => {
    displayMarker(lat, lon);
  }, [lat, lon, map, displayMarker]);

  useEffect(() => {
    map &&
      kakao.maps.event.addListener(
        map,
        'click',
        function (mouseEvent: kakao.maps.event.MouseEvent) {
          const latlng = mouseEvent.latLng;
          displayInfoWindow(latlng.getLat(), latlng.getLng());
        }
      );
  }, [map, displayInfoWindow]);

  return (
    <div
      id="map"
      style={{
        width: '100%',
        height: '87%',
      }}
    ></div>
  );
}
