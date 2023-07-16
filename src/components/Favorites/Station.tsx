import React from 'react';

export default function Station() {
  const station = {
    count: 2,
    favoriteStationResponses: [
      {
        name: '108. 서교동 사거리',
        latitude: 37.55274582,
        longitude: 126.91861725,
        id: 'ST-10',
      },
      {
        name: '729. 서부식자재마트 건너편',
        latitude: 37.51037979,
        longitude: 126.8667984,
        id: 'ST-1000',
      },
    ],
  };

  return <div>Station</div>;
}
