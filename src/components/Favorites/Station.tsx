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
} from '@mui/material';
import { useSetAtom } from 'jotai';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';

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
  const [deletedStationId, setDeletedStationId] = useState('');

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
    if (!stations) {
      setFavoriteStation([]);
      return;
    }

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

  const favoriteStationClickHandler = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    latitude: number,
    longitude: number
  ) => {
    e.preventDefault();
    setTabValue(ROUTES);
    moveToLocation({ latitude, longitude, type: STATION });
  };

  const handleDeleteIconClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    stationId: string
  ) => {
    e.stopPropagation();
    setIsOpenedAlert(true);
    setDeletedStationId(stationId);
  };

  const handleDeleteFavoriteStationConfirm = async (stationId: string) => {
    try {
      await deleteFavoriteStation(stationId, accessToken);
      setDeletedStationId('');
      setFavoriteStation(
        favoriteStation.filter((station) => station.id !== stationId)
      );
      setIsOpenedAlert(false);
    } catch (e) {
      console.error(e);
    }
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
            <Fragment key={`${id}-${index}`}>
              <ListItem
                style={{ cursor: 'pointer' }}
                onClick={(e) =>
                  favoriteStationClickHandler(e, latitude, longitude)
                }
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => handleDeleteIconClick(e, id)}
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
              {id === deletedStationId && (
                <AlertDialog
                  isOpened={isOpenedAlert}
                  setIsOpened={setIsOpenedAlert}
                  title={'삭제'}
                  description={`다음 대여소를 즐겨찾기에서 삭제하시겠습니까?`}
                  onConfirm={() => handleDeleteFavoriteStationConfirm(id)}
                />
              )}
            </Fragment>
          )
        )}
      </List>
    </>
  );
}
