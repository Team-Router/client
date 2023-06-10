'use client';

import { Box, TextField } from '@mui/material';

import { useKakaoMap } from '@/hooks/useKakaoMap';

export default function PointInput() {
  const { startAddress, endAddress } = useKakaoMap();

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
        fullWidth
        label="출발지"
        defaultValue={startAddress ? startAddress : '출발지 간단 도로명주소'}
        variant="filled"
        size="small"
      />
      <TextField
        fullWidth
        label="도착지"
        defaultValue={endAddress ? endAddress : '도착지 간단 도로명주소'}
        variant="filled"
        size="small"
      />
    </Box>
  );
}
