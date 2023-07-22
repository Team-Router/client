import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useRef } from 'react';

import { getRealTimeStation } from '@/api/station';
import { addressAtom, locationAtom, mapAtom } from '@/store/atom';
import { getInfoWindowElement } from '@/utils/getElement';

type pointType = 'start' | 'end';

const MARKER_START =
  'https://github.com/Team-Router/client/assets/75886763/b1d697f6-e9d3-45a1-867f-37e2af12dc4b';
const MARKER_END =
  'https://github.com/Team-Router/client/assets/75886763/f32cd77f-ae9d-46e0-a659-a99215c64562';

export function useKakaoMap() {
  const map = useAtomValue(mapAtom);
  const [address, setAddress] = useAtom(addressAtom);
  const [location, setLocation] = useAtom(locationAtom);
  const startMarker = useRef<kakao.maps.Marker>();
  const endMarker = useRef<kakao.maps.Marker>();
  const infoWindow = useRef<kakao.maps.InfoWindow | null>();
  const stationInfoWindows = useRef<kakao.maps.InfoWindow[]>([]);

  const getPosition = (lat: number, lon: number) => {
    return new kakao.maps.LatLng(lat, lon);
  };

  const displayMarker = useCallback(
    (lat: number, lon: number, pointType: pointType) => {
      if (!map) {
        return;
      }

      const imageSrc = pointType === 'start' ? MARKER_START : MARKER_END;
      const imageSize = new kakao.maps.Size(42, 42);
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      const locPosition = getPosition(lat, lon);
      const marker = new kakao.maps.Marker({
        position: locPosition,
        image: markerImage,
      });
      marker.setMap(map);

      if (pointType === 'start') {
        startMarker.current?.setMap(null);
        startMarker.current = marker;
      }
      if (pointType === 'end') {
        endMarker.current?.setMap(null);
        endMarker.current = marker;
      }

      map.panTo(locPosition);
    },
    [map]
  );

  const closeInfoWindow = () => {
    if (infoWindow.current) {
      infoWindow.current.close();
    }
  };

  const displayInfoWindow = (lat: number, lon: number) => {
    if (!map) {
      return;
    }

    closeInfoWindow();

    const makeHandler = (pointType: pointType) => {
      return () => {
        changeAddress(lat, lon, pointType);
        displayMarker(lat, lon, pointType);
        closeInfoWindow();
        pointType === 'start' &&
          setLocation({ ...location, startLatitude: lat, startLongitude: lon });
        pointType === 'end' &&
          setLocation({ ...location, endLatitude: lat, endLongitude: lon });
      };
    };

    const iwContent = getInfoWindowElement(
      makeHandler('start'),
      makeHandler('end')
    );
    const iwPosition = getPosition(lat, lon);
    const newInfowindow = new kakao.maps.InfoWindow({
      map: map,
      position: iwPosition,
      content: iwContent,
    });
    infoWindow.current = newInfowindow;
  };

  const changeAddress = (lat: number, lon: number, pointType: pointType) => {
    const geocoder = new kakao.maps.services.Geocoder();
    const callback = (result: any, status: kakao.maps.services.Status) => {
      if (status === kakao.maps.services.Status.OK) {
        const newAddress = result[0].address.address_name;
        pointType === 'start' && setAddress({ ...address, start: newAddress });
        pointType === 'end' && setAddress({ ...address, end: newAddress });
      } else {
        alert('현재 위치의 주소를 가져올 수 없습니다.');
      }
    };

    geocoder.coord2Address(lon, lat, callback);
  };

  const closeRealTimeStationInfoWindow = () => {
    if (stationInfoWindows.current) {
      for (const stationInfoWindow of stationInfoWindows.current) {
        stationInfoWindow.close();
      }
    }
  };

  const displayRealTimeStation = async () => {
    if (!map) {
      return;
    }

    closeRealTimeStationInfoWindow();

    const mapCenterLocation = map.getCenter();
    try {
      const { stationRealtimeResponses } = await getRealTimeStation({
        latitude: mapCenterLocation.getLat(),
        longitude: mapCenterLocation.getLng(),
      });
      if (stationRealtimeResponses.length === 0) {
        throw new Error();
      }
      stationInfoWindows.current.push(
        ...stationRealtimeResponses.map(
          (stationRealtime) =>
            new kakao.maps.InfoWindow({
              map,
              position: new kakao.maps.LatLng(
                stationRealtime.latitude,
                stationRealtime.longitude
              ),
              content: `<div style="display: flex; padding:5px;">대여 가능: ${stationRealtime.count}</div>`,
            })
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return {
    getPosition,
    displayMarker,
    displayInfoWindow,
    closeInfoWindow,
    changeAddress,
    displayRealTimeStation,
    closeRealTimeStationInfoWindow,
  };
}
