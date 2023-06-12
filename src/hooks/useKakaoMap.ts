import { useAtomValue } from 'jotai';
import { useCallback, useRef, useState } from 'react';

import { mapAtom } from '@/store/atom';
import { getInfoWindowElement } from '@/utils/infoWindowElement';

type pointType = 'start' | 'end';

export function useKakaoMap() {
  const map = useAtomValue(mapAtom);
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const startMarker = useRef<kakao.maps.Marker>();
  const endMarker = useRef<kakao.maps.Marker>();
  const infoWindow = useRef<kakao.maps.InfoWindow | null>();

  const getPosition = (lat: number, lon: number) => {
    return new kakao.maps.LatLng(lat, lon);
  };

  const displayMarker = useCallback(
    (lat: number, lon: number, pointType: pointType) => {
      if (!map) {
        return;
      }

      const locPosition = getPosition(lat, lon);
      const marker = new kakao.maps.Marker({
        map: map,
        position: locPosition,
      });
      if (pointType === 'start') {
        startMarker.current && startMarker.current.setMap(null);
        startMarker.current = marker;
      }
      if (pointType === 'end') {
        endMarker.current && endMarker.current.setMap(null);
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
        const address = result[0].address.address_name;
        pointType === 'start' && setStartAddress(address);
        pointType === 'end' && setEndAddress(address);
      } else {
        alert('현재 위치의 주소를 가져올 수 없습니다.');
      }
    };

    geocoder.coord2Address(lon, lat, callback);
  };

  return {
    startAddress,
    endAddress,
    getPosition,
    displayMarker,
    displayInfoWindow,
    closeInfoWindow,
  };
}
