'use client';

import { useEffect, useState } from 'react';

import KaKaoMap from '@/components/KaKaoMap';
import PointInput from '@/components/PointInput';

export default function Home() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [startPoint, setStartPoint] = useState('');

  useEffect(() => {
    const $script = document.createElement('script');
    $script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&libraries=services&autoload=false`;
    $script.addEventListener('load', () => setMapLoaded(true));
    document.head.appendChild($script);
  }, []);

  return (
    <>
      <PointInput startPoint={startPoint} />
      {mapLoaded && <KaKaoMap setStartPoint={setStartPoint} />}
    </>
  );
}
