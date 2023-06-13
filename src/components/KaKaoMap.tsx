'use client';

import { useAtom } from 'jotai';
import Script from 'next/script';
import React, { useEffect, useRef } from 'react';

import { useGeolocation } from '@/hooks/useGeolocation';
import { useKakaoMap } from '@/hooks/useKakaoMap';
import { mapAtom } from '@/store/atom';

export default function KakaoMap() {
  const [map, setMap] = useAtom(mapAtom);
  const mapRef = useRef<HTMLDivElement>(null);

  const { displayMarker, displayInfoWindow, closeInfoWindow } = useKakaoMap();
  const { lat, lon, initPosition } = useGeolocation();

  useEffect(() => {
    displayMarker(lat, lon, 'start');
  }, [lat, lon, displayMarker]);

  useEffect(() => {
    if (!map) {
      return;
    }

    const onClickMap = (mouseEvent: kakao.maps.event.MouseEvent) => {
      const latlng = mouseEvent.latLng;
      displayInfoWindow(latlng.getLat(), latlng.getLng());
    };

    kakao.maps.event.addListener(map, 'click', onClickMap);
    kakao.maps.event.addListener(map, 'dragend', closeInfoWindow);
    return () => {
      kakao.maps.event.removeListener(map, 'click', onClickMap);
      kakao.maps.event.removeListener(map, 'dragend', closeInfoWindow);
    };
  }, [map, displayInfoWindow, closeInfoWindow]);

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
