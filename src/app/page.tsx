'use client';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import AddressInput from '@/components/AddressInput';
import FavoritesTabs from '@/components/Favorites/FavoritesTab';
import KaKaoMap from '@/components/KaKaoMap';

export default function Home() {
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
        <Tab
          icon={<DirectionsBikeIcon />}
          aria-label="routes"
          label="경로 찾기"
        />
        <Tab icon={<FavoriteIcon />} aria-label="favorite" label="즐겨찾기" />
      </Tabs>
      {tabValue === 0 && (
        <>
          <AddressInput />
          <KaKaoMap />
        </>
      )}
      {tabValue === 1 && <FavoritesTabs />}
    </>
  );
}
