'use client';
import BusinessIcon from '@mui/icons-material/Business';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
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

import { deleteFavoritePlace, getAllFavoritePlace } from '@/api/favorite';
import { END, ROUTES, START } from '@/constants';
import { useKakaoMap } from '@/hooks/useKakaoMap';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { moveToLocationGlobalParamAtom, pageTabAtom } from '@/store/atom';
import type { MoveToLocationParam } from '@/types/direction';
import type { Place } from '@/types/favorite';

import AlertDialog from '../AlertDialog';

export default function Place() {
  const setTabValue = useSetAtom(pageTabAtom);
  const setMoveToLocationGlobalParam = useSetAtom(
    moveToLocationGlobalParamAtom
  );
  const { changeAddressWithGeocoder } = useKakaoMap();

  const [favoritePlaces, setFavoritePlaces] = useState<Place[]>([]);
  const [accessToken] = useLocalStorage('accessToken', null);
  const [isOpenedAlert, setIsOpenedAlert] = useState(false);
  const [deletedPlaceId, setDeletedPlaceId] = useState(0);

  useEffect(() => {
    try {
      if (accessToken) {
        getFavoritePlaces();
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

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

  const favoritePlackClickHandler = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    latitude: number,
    longitude: number
  ) => {
    e.preventDefault();
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
    setMoveToLocationGlobalParam(param);
  };

  const handleClickOpenDialog = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    placeId: number
  ) => {
    e.stopPropagation();
    setIsOpenedAlert(true);
    setDeletedPlaceId(placeId);
  };

  const handleDeleteFavoritePlace = async (placeId: number) => {
    try {
      await deleteFavoritePlace(placeId, accessToken);
      setDeletedPlaceId(0);
      setFavoritePlaces(favoritePlaces.filter((place) => place.id !== placeId));
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

  if (!favoritePlaces.length) {
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
          <ListItemText primary={'즐겨찾기 장소를 추가해주세요.'} />
        </ListItem>
      </List>
    );
  }

  return (
    <>
      <List>
        {favoritePlaces.map(
          ({ id, name, address, latitude, longitude }, index) => (
            <Fragment key={`${name}-${id}-${index}`}>
              <ListItem
                style={{ cursor: 'pointer' }}
                onClick={(e) =>
                  favoritePlackClickHandler(e, latitude, longitude)
                }
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => handleClickOpenDialog(e, id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
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
              {id === deletedPlaceId && (
                <AlertDialog
                  isOpened={isOpenedAlert}
                  setIsOpened={setIsOpenedAlert}
                  title={'삭제'}
                  description={`다음 장소를 즐겨찾기에서 삭제하시겠습니까?`}
                  onConfirm={() => handleDeleteFavoritePlace(id)}
                />
              )}
            </Fragment>
          )
        )}
      </List>
    </>
  );
}
