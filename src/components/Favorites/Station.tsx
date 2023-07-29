'use client';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
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

import { getFavoriteAllStation } from '@/api/favorite';
import { ROUTES, STATION } from '@/constants';
import { useKakaoMap } from '@/hooks/useKakaoMap';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { pageTabAtom } from '@/store/atom';
import type { Station } from '@/types/favorite';

export default function Station() {
  const setTabValue = useSetAtom(pageTabAtom);
  const [favoriteStation, setFavoriteStation] = useState<Station[]>([]);
  const [accessToken] = useLocalStorage('accessToken', null);
  const { changeAddressWithGeocoder, moveToLocation } = useKakaoMap();

  useEffect(() => {
    try {
      if (accessToken) {
        getFavoriteStations();
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

  const getFavoriteStations = async () => {
    if (!accessToken) {
      return;
    }
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

  const favoriteStationClickHandler = (latitude: number, longitude: number) => {
    setTabValue(ROUTES);
    moveToLocation({ latitude, longitude, type: STATION });
  };

  return (
    <List>
      {favoriteStation.map(
        ({ name, id, address, latitude, longitude }, index) => (
          <ListItem
            key={`${id}-${index}`}
            style={{ cursor: 'pointer' }}
            onClick={() => favoriteStationClickHandler(latitude, longitude)}
          >
            <ListItemAvatar>
              <Avatar>
                <DirectionsBikeIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={name} secondary={address} />
          </ListItem>
        )
      )}
    </List>
  );
}
