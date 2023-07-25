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

import { getFavoriteAllStation } from '@/api/favorite';
import { useKakaoMap } from '@/hooks/useKakaoMap';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Station } from '@/types/favorite';

export default function Station() {
  const { changeAddressWithGeocoder } = useKakaoMap();
  const [favoriteStation, setFavoriteStation] = useState<Station[]>([]);
  const [accessToken, setAccessToken] = useLocalStorage('accessToken', null);

  useEffect(() => {
    try {
      getFavoriteStations();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getFavoriteStations = async () => {
    const stations = await getFavoriteAllStation(accessToken);
    setFavoriteStation(
      stations.favoriteStationResponses.map((station: Station) => {
        const { latitude, longitude } = station;
        const address = getAddressFromLatLon(latitude, longitude);
        return { ...station, address };
      })
    );
  };

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
