import React from 'react';

export default function Place() {
  const place = {
    count: 4,
    favoritePlaces: [
      {
        id: 2,
        name: 'OFFICE',
        latitude: 37.60810089,
        longitude: 127.10118103,
      },
      {
        id: 4,
        name: 'HOME',
        latitude: 37.20810089,
        longitude: 127.20118103,
      },
      {
        id: 5,
        name: 'NORMAL',
        latitude: 37.30810089,
        longitude: 127.30118103,
      },
      {
        id: 6,
        name: 'NORMAL',
        latitude: 37.40810089,
        longitude: 127.40118103,
      },
    ],
  };

  return <div>Place</div>;
}
