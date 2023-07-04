'use client';
import Image from 'next/image';
import React from 'react';

export default function LoginForm() {
  return (
    <>
      <button
        aria-label="kakao-login-button"
        style={{
          width: '100%',
          height: '48px',
          display: 'flex',
          justifyItems: 'center',
          alignItems: 'center',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: '#FEE500',
          cursor: 'pointer',
        }}
        // onClick={handleClickKakaoLoginButton}
      >
        <Image
          src="/kakao.svg"
          alt="kakao-symbol"
          width={18}
          height={18}
          style={{ paddingLeft: '20px' }}
        />
        <p
          style={{
            width: '100%',
            color: '#121212',
            fontSize: '16px',
          }}
        >
          카카오 로그인
        </p>
      </button>
    </>
  );
}
