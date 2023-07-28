'use client';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Tab, Tabs } from '@mui/material';
import { useAtom } from 'jotai';

import AddressInput from '@/components/AddressInput';
import FavoritesTabs from '@/components/Favorites/FavoritesTab';
import KaKaoMap from '@/components/KaKaoMap';
import { FAVORITE, ROUTES } from '@/constants';
import { pageTabAtom } from '@/store/atom';

export default function Home() {
  const [tabValue, setTabValue] = useAtom(pageTabAtom);

  const handleChange = (event: React.SyntheticEvent, newTabValue: string) => {
    setTabValue(newTabValue);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
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
          value={ROUTES}
        />
        <Tab
          icon={<FavoriteIcon />}
          aria-label="favorite"
          label="즐겨찾기"
          value={FAVORITE}
        />
      </Tabs>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: tabValue === ROUTES ? 9 : -9,
        }}
      >
        <AddressInput />
        <KaKaoMap />
      </div>
      {tabValue === FAVORITE && (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: tabValue === FAVORITE ? 9 : -9,
          }}
        >
          <FavoritesTabs />
        </div>
      )}
    </div>
  );
}
