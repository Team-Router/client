'use client';

import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Example1() {
  const router = useRouter();

  return (
    <>
      <div>Example1</div>
      <Button onClick={() => router.back()}>Go Back</Button>
    </>
  );
}
