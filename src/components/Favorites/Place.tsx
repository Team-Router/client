'use client';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { useSetAtom } from 'jotai';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { getAllFavoritePlace } from '@/api/favorite';
import { END, ROUTES, START } from '@/constants';
import { useKakaoMap } from '@/hooks/useKakaoMap';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { pageTabAtom } from '@/store/atom';
import type { MoveToLocationParam } from '@/types/direction';
import type { Place } from '@/types/favorite';

export default function Place() {
  const setTabValue = useSetAtom(pageTabAtom);
  const { changeAddressWithGeocoder, moveToLocation } = useKakaoMap();
  const [favoritePlaces, setFavoritePlaces] = useState<Place[]>([]);
  const [accessToken] = useLocalStorage('accessToken', null);

  useEffect(() => {
    try {
      if (accessToken) {
        getFavoritePlaces();
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!accessToken) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Link href={'/oauth'}>
          <Button>로그인하러 가기</Button>
        </Link>
      </div>
    );
  }

  const getFavoritePlaces = async () => {
    if (!accessToken) {
      return;
    }

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

  const favoritePlackClickHandler = (latitude: number, longitude: number) => {
    const param: MoveToLocationParam = { latitude, longitude, type: START };
    const isStart = window.confirm('출발지로 설정할까요?');
    if (!isStart) {
      const isEnd = window.confirm('도착지로 설정할까요?');
      if (!isEnd) {
        return;
      }
      param.type = END;
    }
    setTabValue(ROUTES);
    moveToLocation(param);
  };

  return (
    <List>
      {favoritePlaces.map(
        ({ id, name, address, latitude, longitude }, index) => (
          <ListItem
            key={`${name}-${id}-${index}`}
            style={{ cursor: 'pointer' }}
            onClick={() => favoritePlackClickHandler(latitude, longitude)}
          >
            <ListItemAvatar>
              <Avatar>
                {name === 'HOME' && <HomeIcon />}
                {name === 'OFFICE' && <BusinessIcon />}
                {name === 'NORMAL' && <MapsHomeWorkIcon />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={address} />
          </ListItem>
        )
      )}
    </List>
  );
}
