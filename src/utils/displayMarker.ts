export const displayMarker = (
  map: kakao.maps.Map,
  locPosition: kakao.maps.LatLng,
  message: string
) => {
  const marker = new kakao.maps.Marker({
    map: map,
    position: locPosition,
  });

  const iwContent = message;
  const iwRemoveable = true;

  const infowindow = new kakao.maps.InfoWindow({
    content: iwContent,
    removable: iwRemoveable,
  });

  infowindow.open(map, marker);

  map.setCenter(locPosition);
};
