'use client';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Snackbar,
} from '@mui/material';
import { useSetAtom } from 'jotai';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { deleteFavoriteStation, getFavoriteAllStation } from '@/api/favorite';
import { ROUTES, STATION } from '@/constants';
import { useKakaoMap } from '@/hooks/useKakaoMap';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { pageTabAtom } from '@/store/atom';
import type { Station } from '@/types/favorite';

import AlertDialog from '../AlertDialog';

export default function Station() {
  const setTabValue = useSetAtom(pageTabAtom);
  const [accessToken] = useLocalStorage('accessToken', null);
  const { changeAddressWithGeocoder, moveToLocation } = useKakaoMap();

  const [favoriteStation, setFavoriteStation] = useState<Station[]>([]);
  const [isOpenedAlert, setIsOpenedAlert] = useState(false);

  useEffect(() => {
    try {
      if (accessToken) {
        getFavoriteStations();
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

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

  const handleClickDeleteFavoriteStation = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsOpenedAlert(true);
  };

  const handleDeleteFavoriteStation = async (stationId: string) => {
    await deleteFavoriteStation(stationId, accessToken);
  };

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

  if (!favoriteStation.length) {
    return (
      <List>
        <ListItem
          onClick={() => setTabValue(ROUTES)}
          style={{ cursor: 'pointer' }}
        >
          <ListItemAvatar>
            <Avatar>
              <PlaylistAddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={'즐겨찾기 대여소를 추가해주세요.'} />
        </ListItem>
      </List>
    );
  }

  return (
    <>
      <List>
        {favoriteStation.map(
          ({ name, id, address, latitude, longitude }, index) => (
            <>
              <ListItem
                key={`${id}-${index}`}
                style={{ cursor: 'pointer' }}
                onClick={() => favoriteStationClickHandler(latitude, longitude)}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => handleClickDeleteFavoriteStation(e)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <DirectionsBikeIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={name} secondary={address} />
              </ListItem>
              <AlertDialog
                isOpened={isOpenedAlert}
                setIsOpened={setIsOpenedAlert}
                title={'즐겨찾기 장소 삭제'}
                description={`${address}를 즐겨찾기에서 삭제하시겠습니까?`}
                onConfirm={() => handleDeleteFavoriteStation(id)}
              />
            </>
          )
        )}
      </List>
    </>
  );
}
