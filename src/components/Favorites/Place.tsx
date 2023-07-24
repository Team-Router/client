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

import { useKakaoMap } from '@/hooks/useKakaoMap';

interface Place {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: Promise<string>;
}

export default function Place() {
  const { changeAddressWithGeocoder } = useKakaoMap();
  const [favoritePlaces, setFavoritePlaces] = useState<Place[]>([]);

  const places = {
    count: 4,
    favoritePlaces: [
      {
        id: 2,
        name: 'OFFICE',
        latitude: 37.60810089,
        longitude: 127.10118103,
      },
      {
        id: 4,
        name: 'HOME',
        latitude: 37.20810089,
        longitude: 127.20118103,
      },
      {
        id: 5,
        name: 'NORMAL',
        latitude: 37.30810089,
        longitude: 127.30118103,
      },
      {
        id: 6,
        name: 'NORMAL',
        latitude: 37.40810089,
        longitude: 127.40118103,
      },
    ],
  };

  useEffect(() => {
    setFavoritePlaces(
      places.favoritePlaces.map((place) => ({
        ...place,
        address: getAddressFromLatLon(place.latitude, place.longitude),
      }))
    );
  }, []);

  const getAddressFromLatLon = async (lat: number, lon: number) => {
    const address = await changeAddressWithGeocoder(lat, lon);
    return address as string;
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
