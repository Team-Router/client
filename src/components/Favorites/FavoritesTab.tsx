'use client';

import { Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';

import Place from '@/components/Favorites/Place';
import Station from '@/components/Favorites/Station';
import { PLACE, STATION } from '@/constants';

export default function FavoritesTab() {
  const [tabValue, setTabValue] = useState(STATION);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newTabValue: string
  ) => {
    setTabValue(newTabValue);
  };

  return (
    <>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="icon-tabs"
        variant="fullWidth"
      >
        <Tab aria-label="station" label="대여소" value={STATION} />
        <Tab aria-label="place" label="장소" value={PLACE} />
      </Tabs>
      {tabValue === STATION && <Station />}
      {tabValue === PLACE && <Place />}
    </>
  );
}
