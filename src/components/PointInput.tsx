'use client';

import { Box, TextField } from '@mui/material';

export default function PointInput({ startPoint }: { startPoint: string }) {
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
        defaultValue={startPoint ? startPoint : '출발지 간단 도로명주소'}
        variant="filled"
        size="small"
      />
      <TextField
        fullWidth
        label="도착지"
        defaultValue="도착지 간단 도로명주소"
        variant="filled"
        size="small"
      />
    </Box>
  );
}
