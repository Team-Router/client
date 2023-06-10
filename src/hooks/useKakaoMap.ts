import { useAtomValue } from 'jotai';

import { mapAtom } from '@/store/atom';

export function useKakaoMap() {
  const map = useAtomValue(mapAtom);

  const getPosition = (lat: number, lon: number) => {
    return new kakao.maps.LatLng(lat, lon);
  };

  const displayMarker = (lat: number, lon: number) => {
    if (!map) {
      return;
    }

    const locPosition = getPosition(lat, lon);
    new kakao.maps.Marker({
      map: map,
      position: locPosition,
    });
    map.setCenter(locPosition);
  };

  const displayInfoWindow = (lat: number, lon: number) => {
    if (!map) {
      return;
    }
    const iwContent = '<div style="padding:5px;">Hello World!</div>';
    const iwPosition = getPosition(lat, lon);
    const infowindow = new kakao.maps.InfoWindow({
      map: map,
      position: iwPosition,
      content: iwContent,
    });
  };

  return { getPosition, displayMarker, displayInfoWindow };
}
