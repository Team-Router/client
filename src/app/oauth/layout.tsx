import React from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: '#1a2440',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '30px',
      }}
    >
      <h1
        style={{
          color: 'white',
          fontSize: '50px',
        }}
      >
        RE-cycle
      </h1>
      <div
        style={{
          width: '100%',
          marginTop: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {children}
      </div>
    </div>
  );
}
