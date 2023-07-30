import { useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';

import { addFavoritePlace, addFavoriteStation } from '@/api/favorite';
import { getRealTimeStation } from '@/api/station';
import { END, MARKER_END, MARKER_START, START, STATION } from '@/constants';
import { addressAtom, locationAtom, mapAtom } from '@/store/atom';
import type { MoveToLocationParam, pointType } from '@/types/direction';
import type { StationData } from '@/types/station';
import { getButtonElement, getInfoWindowElement } from '@/utils/getElement';

import { useLocalStorage } from './useLocalStorage';

export function useKakaoMap() {
  const router = useRouter();
  const map = useAtomValue(mapAtom);
  const [address, setAddress] = useAtom(addressAtom);
  const [location, setLocation] = useAtom(locationAtom);
  const startMarker = useRef<kakao.maps.Marker>();
  const endMarker = useRef<kakao.maps.Marker>();
  const [accessToken] = useLocalStorage('accessToken', null);
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

      const imageSrc = pointType === START ? MARKER_START : MARKER_END;
      const imageSize = new kakao.maps.Size(42, 42);
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      const locPosition = getPosition(lat, lon);
      const marker = new kakao.maps.Marker({
        position: locPosition,
        image: markerImage,
      });

      if (pointType === START) {
        startMarker.current?.setMap(null);
        startMarker.current = marker;
      }
      if (pointType === END) {
        endMarker.current?.setMap(null);
        endMarker.current = marker;
      }
      console.log(startMarker, endMarker);
      marker.setMap(map);
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
        displayMarker(lat, lon, pointType);
        changeAddress(lat, lon, pointType);
        closeInfoWindow();
        pointType === START &&
          setLocation({ ...location, startLatitude: lat, startLongitude: lon });
        pointType === END &&
          setLocation({ ...location, endLatitude: lat, endLongitude: lon });
      };
    };

    const addFavoritePlaceHandler = () => {
      if (!accessToken) {
        window.alert('로그인 먼저 바랍니다.');
        router.push('/oauth');
        return;
      }

      const favoritePlaceName = window.prompt('무엇으로 저장하시겠습니까?');
      if (!favoritePlaceName) {
        return;
      }

      const param = {
        name: favoritePlaceName,
        longitude: lon,
        latitude: lat,
      };
      addFavoritePlace(param, accessToken);
      closeInfoWindow();
    };

    const iwContent = getInfoWindowElement(
      makeHandler(START),
      makeHandler(END),
      addFavoritePlaceHandler
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
        pointType === START && setAddress({ ...address, start: newAddress });
        pointType === END && setAddress({ ...address, end: newAddress });
      } else {
        alert('현재 위치의 주소를 가져올 수 없습니다.');
      }
    };

    geocoder.coord2Address(lon, lat, callback);
  };

  const changeAddressWithGeocoder = (lat: number, lon: number) => {
    const geocoder = new kakao.maps.services.Geocoder();

    return new Promise((resolve, reject) =>
      geocoder.coord2Address(
        lon,
        lat,
        (result: any, status: kakao.maps.services.Status) => {
          if (status === kakao.maps.services.Status.OK) {
            resolve(result[0].address.address_name);
          } else {
            alert('현재 위치의 주소를 가져올 수 없습니다.');
            reject(status);
          }
        }
      )
    );
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

    const addFavoriteStationHandler = (stationId: string) => {
      if (!accessToken) {
        window.alert('로그인 먼저 바랍니다.');
        router.push('/oauth');
        return;
      }
      addFavoriteStation(stationId, accessToken);
    };

    const stationInfoWindowContent = (stationRealtime: StationData) => {
      const $div = document.createElement('div');
      $div.setAttribute('style', 'display: flex; padding:5px;');
      $div.innerText = `대여 가능: ${stationRealtime.count}`;
      $div.appendChild(
        getButtonElement('+', () =>
          addFavoriteStationHandler(stationRealtime.id)
        )
      );
      return $div;
    };

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
              content: stationInfoWindowContent(stationRealtime),
            })
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const moveToLocation = ({
    latitude,
    longitude,
    type,
  }: MoveToLocationParam) => {
    if (!map) {
      return;
    }

    const locPosition = getPosition(latitude, longitude);
    if (type === STATION) {
      map.panTo(locPosition);
      return;
    }

    if (type === START) {
      setLocation({
        ...location,
        startLatitude: latitude,
        startLongitude: longitude,
      });
    }
    if (type === END) {
      setLocation({
        ...location,
        endLatitude: latitude,
        endLongitude: longitude,
      });
    }
    displayMarker(latitude, longitude, type);
    changeAddress(latitude, longitude, type);
  };

  return {
    getPosition,
    displayMarker,
    displayInfoWindow,
    closeInfoWindow,
    changeAddress,
    changeAddressWithGeocoder,
    displayRealTimeStation,
    closeRealTimeStationInfoWindow,
    moveToLocation,
  };
}
