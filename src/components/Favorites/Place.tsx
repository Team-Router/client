'use client';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { getAllFavoritePlace } from '@/api/favorite';
import { useKakaoMap } from '@/hooks/useKakaoMap';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Place } from '@/types/favorite';

export default function Place() {
  const { changeAddressWithGeocoder } = useKakaoMap();
  const [favoritePlaces, setFavoritePlaces] = useState<Place[]>([]);
  const [accessToken, setAccessToken] = useLocalStorage('accessToken', null);

  useEffect(() => {
    try {
      getFavoritePlaces();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getFavoritePlaces = async () => {
    const stations = await getAllFavoritePlace(accessToken);
    setFavoritePlaces(
      stations.favoritePlaces.map((place: Place) => {
        const { latitude, longitude } = place;
        const address = getAddressFromLatLon(latitude, longitude);
        return { ...place, address };
      })
    );
  };

  const getAddressFromLatLon = async (lat: number, lon: number) => {
    const address = (await changeAddressWithGeocoder(lat, lon)) as string;
    return address;
  };

  return (
    <List>
      {favoritePlaces.map(({ id, name, address }, index) => (
        <ListItem key={`${name}-${id}-${index}`}>
          <ListItemAvatar>
            <Avatar>
              {name === 'HOME' && <HomeIcon />}
              {name === 'OFFICE' && <BusinessIcon />}
              {name === 'NORMAL' && <MapsHomeWorkIcon />}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={address} />
        </ListItem>
      ))}
    </List>
  );
}
