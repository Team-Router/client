'use client';

import { Button } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import Script from 'next/script';
import React, { useCallback, useEffect, useRef } from 'react';

import { getDirectionBySelectedLocation } from '@/api/direction';
import { PEDESTRIAN } from '@/constants';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useKakaoMap } from '@/hooks/useKakaoMap';
import { addressAtom, locationAtom, mapAtom } from '@/store/atom';
import type { Location, RoutingProfile } from '@/types/direction';
import { getResultOverlayElement } from '@/utils/getElement';

export default function KakaoMap() {
  const address = useAtomValue(addressAtom);
  const location = useAtomValue(locationAtom);
  const [map, setMap] = useAtom(mapAtom);
  const mapRef = useRef<HTMLDivElement>(null);
  const polylines = useRef<kakao.maps.Polyline[]>([]);
  const resultOverlays = useRef<kakao.maps.CustomOverlay[]>([]);

  const {
    displayMarker,
    displayInfoWindow,
    closeInfoWindow,
    getPosition,
    displayRealTimeStation,
    closeRealTimeStationInfoWindow,
  } = useKakaoMap();
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
    const { routes } = await getDirectionBySelectedLocation(location);

    if (routes.length === 0) {
      alert('경로가 없습니다.');
    }

    routes.forEach(({ locations, routingProfile, distance, duration }) => {
      const polyline = getPolylineOfDirection(locations, routingProfile);
      polyline.setMap(map);
      polylines.current?.push(polyline);
      displayResultOverlay(
        locations[locations.length - 1].latitude,
        locations[locations.length - 1].longitude,
        distance,
        duration,
        routingProfile
      );
    });
  }, [location]);

  const clearPolylines = () => {
    polylines.current?.forEach((polyline) => polyline.setMap(null));
    polylines.current = [];
  };

  const displayResultOverlay = (
    latitude: number,
    longitude: number,
    distance: number,
    duration: number,
    routingProfile: RoutingProfile
  ) => {
    const resultOverlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(latitude, longitude),
      content: getResultOverlayElement(distance, duration, routingProfile),
    });
    resultOverlay.setMap(map);
    resultOverlays.current.push(resultOverlay);
  };

  const clearResultOverlays = () => {
    resultOverlays.current.forEach((overlay) => overlay.setMap(null));
    resultOverlays.current = [];
  };

  useEffect(() => {
    if (address.start && address.end) {
      clearPolylines();
      clearResultOverlays();
      postDirection();
      closeRealTimeStationInfoWindow();
    }
  }, [address, postDirection, closeRealTimeStationInfoWindow]);

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
      <Button onClick={displayRealTimeStation} fullWidth>
        현 지도에서 대여소 검색
      </Button>
      <div
        ref={mapRef}
        id="kakao-map"
        style={{
          width: '100%',
          height: '83%',
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
