'use client';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { addFavoriteStation, getFavoriteAllStation } from '@/api/favorite';
import { useKakaoMap } from '@/hooks/useKakaoMap';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface StationInfo {
  count: string;
  favoriteStationResponses: Station[];
}
interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: Promise<string>;
}

export default function Station() {
  const { changeAddressWithGeocoder } = useKakaoMap();
  const [favoriteStation, setFavoriteStation] = useState<Station[]>([]);
  const [accessToken, setAccessToken] = useLocalStorage('accessToken', null);

  const stations = {
    count: 2,
    favoriteStationResponses: [
      {
        name: '108. 서교동 사거리',
        latitude: 37.55274582,
        longitude: 126.91861725,
        id: 'ST-10',
      },
      {
        name: '729. 서부식자재마트 건너편',
        latitude: 37.51037979,
        longitude: 126.8667984,
        id: 'ST-1000',
      },
    ],
  };

  // 생명주기 -> mount(초기) , update(업데이트), unmount(종료)

  useEffect(() => {
    const response = addFavoriteStation('ST-3075', accessToken);
    console.log(response);
    // const stations = getFavoriteAllStation(accessToken);
    // console.log(stations); // 즐겨찾기 가져오기\

    // setFavoriteStation(
    //   stations.favoriteStationResponses.map((station) => {
    //     const { latitude, longitude } = station;
    //     const address = getAddressFromLatLon(latitude, longitude);
    //     return { ...station, address };
    //   })
    // );
  }, []);

  const getAddressFromLatLon = async (lat: number, lon: number) => {
    const address = (await changeAddressWithGeocoder(lat, lon)) as string;
    return address;
  };

  return (
    <List>
      {favoriteStation.map(({ name, id, address }, index) => (
        <ListItem key={`${id}-${index}`}>
          <ListItemAvatar>
            <Avatar>
              <DirectionsBikeIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={name} secondary={address} />
        </ListItem>
      ))}
    </List>
  );
}
