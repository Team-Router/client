'use client';

import { Box, Button } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import Script from 'next/script';
import React, { useCallback, useEffect, useRef } from 'react';

import {
  getDirectionBySelectedLocation,
  getWalkDirectionBySelectedLocation,
} from '@/api/direction';
import { PEDESTRIAN, START } from '@/constants';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useKakaoMap } from '@/hooks/useKakaoMap';
import { addressAtom, locationAtom, mapAtom } from '@/store/atom';
import type { LocalLocation, RoutingProfile } from '@/types/direction';
import { getResultOverlayElement } from '@/utils/getElement';

export default function KakaoMap() {
  const address = useAtomValue(addressAtom);
  const location = useAtomValue(locationAtom);
  const [map, setMap] = useAtom(mapAtom);
  const mapRef = useRef<HTMLDivElement>(null);
  const polylines = useRef<kakao.maps.Polyline[]>([]);
  const walkPolylines = useRef<kakao.maps.Polyline[]>([]);
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
    displayMarker(location.startLatitude, location.startLongitude, START);
  }, [location.startLatitude, location.startLongitude, displayMarker]);

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
    const { getDirectionsResponses } = await getDirectionBySelectedLocation(
      location
    );

    if (getDirectionsResponses.length === 0) {
      alert('경로가 없습니다.');
      return;
    }

    getDirectionsResponses.forEach(
      ({ locations, routingProfile, distance, duration }) => {
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
      }
    );
  }, [location]);

  const postWalkDirection = async () => {
    const { locations, distance, duration, routingProfile } =
      await getWalkDirectionBySelectedLocation(location);

    if (locations.length === 0) {
      alert('경로가 없습니다.');
      return;
    }

    const polyline = getPolylineOfDirection(locations, routingProfile);
    polyline.setMap(map);
    walkPolylines.current?.push(polyline);
    displayResultOverlay(
      locations[locations.length - 1].latitude,
      locations[locations.length - 1].longitude,
      distance,
      duration,
      routingProfile
    );
  };

  const clearPolylines = () => {
    polylines.current?.forEach((polyline) => polyline.setMap(null));
    polylines.current = [];
    walkPolylines.current?.forEach((polyline) => polyline.setMap(null));
    walkPolylines.current = [];
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
    clearPolylines();
    clearResultOverlays();
  }, [address]);

  const searchDirection = (searchType: 'withCycle' | 'withoutCycle') => {
    clearPolylines();
    clearResultOverlays();
    searchType === 'withCycle' ? postDirection() : postWalkDirection();
    closeRealTimeStationInfoWindow();
  };

  const getPolylineOfDirection = useCallback(
    (locations: LocalLocation[], routingProfile: RoutingProfile) => {
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
      <Box sx={{ display: 'flex' }}>
        <Button
          onClick={() => searchDirection('withCycle')}
          fullWidth
          disabled={!(address.start && address.end)}
        >
          따릉이 대여 경로
        </Button>
        <Button
          onClick={() => searchDirection('withoutCycle')}
          fullWidth
          disabled={!(address.start && address.end)}
        >
          걷기 경로
        </Button>
      </Box>
      <Button
        onClick={displayRealTimeStation}
        sx={{
          position: 'absolute',
          maxWidth: '414px',
          width: '100%',
          zIndex: 1,
        }}
      >
        <div
          style={{
            background: 'white',
            padding: '5px',
            borderRadius: '15px',
            opacity: '85%',
          }}
        >
          현 지도에서 대여소 검색
        </div>
      </Button>
      <div
        ref={mapRef}
        id="kakao-map"
        style={{
          width: '100%',
          height: '81%',
          position: 'relative',
          zIndex: 0,
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
