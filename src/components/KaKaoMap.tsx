'use client';

import { useAtom } from 'jotai';
import Script from 'next/script';
import React, { useEffect, useRef } from 'react';

import { useGeolocation } from '@/hooks/useGeolocation';
import { useKakaoMap } from '@/hooks/useKakaoMap';
import { mapAtom } from '@/store/atom';

interface KaKaoMapProps {
  setStartPoint: React.Dispatch<React.SetStateAction<string>>;
}

export default function KaKaoMap({ setStartPoint }: KaKaoMapProps) {
  const [map, setMap] = useAtom(mapAtom);
  const mapRef = useRef<HTMLDivElement>(null);

  const { displayMarker, displayInfoWindow } = useKakaoMap();
  const { lat, lon, initPosition } = useGeolocation();

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
    <>
      <div
        ref={mapRef}
        id="kakao-map"
        style={{
          width: '100%',
          height: '87%',
        }}
      ></div>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&libraries=services&autoload=false`}
        onReady={() => {
          kakao.maps.load(() => {
            initPosition();
            const options = {
              center: new kakao.maps.LatLng(lat, lon),
              level: 3,
            };
            setMap(
              new kakao.maps.Map(mapRef.current as HTMLDivElement, options)
            );
          });
        }}
      />
    </>
  );
}
