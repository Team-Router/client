'use client';

import { useAtom, useAtomValue } from 'jotai';
import Script from 'next/script';
import React, { useCallback, useEffect, useRef } from 'react';

import { getDirectionBySelectedLocation } from '@/api/direction';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useKakaoMap } from '@/hooks/useKakaoMap';
import { addressAtom, locationAtom, mapAtom } from '@/store/atom';

export default function KakaoMap() {
  const address = useAtomValue(addressAtom);
  const location = useAtomValue(locationAtom);
  const [map, setMap] = useAtom(mapAtom);
  const mapRef = useRef<HTMLDivElement>(null);

  const { displayMarker, displayInfoWindow, closeInfoWindow } = useKakaoMap();
  const { initPosition } = useGeolocation();

  useEffect(() => {
    displayMarker(location.startLatitude, location.startLongitude, 'start');
  }, [location, displayMarker]);

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

  const postDirection = useCallback(async () => {
    const response = await getDirectionBySelectedLocation(location);
    console.log(response);
  }, [location]);

  useEffect(() => {
    if (address.start && address.end) {
      postDirection();
    }
  }, [address, postDirection]);

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
              center: new kakao.maps.LatLng(
                location.startLatitude,
                location.startLongitude
              ),
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
