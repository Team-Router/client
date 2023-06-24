'use client';

import { useAtom, useAtomValue } from 'jotai';
import Script from 'next/script';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { getDirectionBySelectedLocation } from '@/api/direction';
import { PEDESTRIAN, SUCCESS } from '@/constants';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useKakaoMap } from '@/hooks/useKakaoMap';
import { addressAtom, locationAtom, mapAtom } from '@/store/atom';
import { Location, RoutingProfile } from '@/types/direction';

export default function KakaoMap() {
  const address = useAtomValue(addressAtom);
  const location = useAtomValue(locationAtom);
  const [map, setMap] = useAtom(mapAtom);
  const mapRef = useRef<HTMLDivElement>(null);
  const polylines = useRef<kakao.maps.Polyline[]>([]);

  const { displayMarker, displayInfoWindow, closeInfoWindow, getPosition } =
    useKakaoMap();
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
    const { data, result } = await getDirectionBySelectedLocation(location);

    if (result === SUCCESS) {
      data.forEach(({ locations, routingProfile }) => {
        const polyline = getPolylineOfDirection(locations, routingProfile);
        polyline.setMap(map);
        polylines.current?.push(polyline);
      });
    }
  }, [location]);

  const clearPolylines = () => {
    polylines.current?.forEach((polyline) => {
      polyline.setMap(null);
    });
    polylines.current = [];
  };

  useEffect(() => {
    if (address.start && address.end) {
      clearPolylines();
      postDirection();
    }
  }, [address, postDirection]);

  const getPolylineOfDirection = useCallback(
    (locations: Location[], routingProfile: RoutingProfile) => {
      return new kakao.maps.Polyline({
        path: locations.map(({ latitude, longitude }) =>
          getPosition(latitude, longitude)
        ),
        strokeWeight: 5,
        strokeColor: routingProfile === PEDESTRIAN ? '#4285f4' : '#f44270',
        strokeOpacity: 1,
      });
    },
    [getPosition]
  );

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
