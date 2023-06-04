'use client';

import { useState } from 'react';

import KaKaoMap from '@/components/KaKaoMap';
import PointInput from '@/components/PointInput';

export default function Home() {
  const [startPoint, setStartPoint] = useState('');

  return (
    <>
      <PointInput startPoint={startPoint} />
      <KaKaoMap setStartPoint={setStartPoint} />
    </>
  );
}
