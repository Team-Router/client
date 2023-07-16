'use client';

import { Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';

import Place from '@/components/Favorites/Place';
import Station from '@/components/Favorites/Station';

export default function Favorites() {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newTabValue: number) => {
    setTabValue(newTabValue);
  };

  return (
    <>
      <Tabs
        value={tabValue}
        onChange={handleChange}
        aria-label="icon-tabs"
        variant="fullWidth"
      >
        <Tab aria-label="station" label="대여소" />
        <Tab aria-label="place" label="장소" />
      </Tabs>
      {tabValue === 0 && <Station />}
      {tabValue === 1 && <Place />}
    </>
  );
}
