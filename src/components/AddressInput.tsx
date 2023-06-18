'use client';

import { Box, TextField } from '@mui/material';
import { useAtomValue } from 'jotai';

import { addressAtom } from '@/store/atom';

export default function PointInput() {
  const address = useAtomValue(addressAtom);

  return (
    <Box
      sx={{
        margin: '10px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <TextField
        size="small"
        fullWidth
        defaultValue={address.start || '출발지'}
        disabled
      />
      <TextField
        size="small"
        fullWidth
        defaultValue={address.end || '도착지'}
        disabled
      />
    </Box>
  );
}
