'use client';
import Image from 'next/image';
import React from 'react';

export default function LoginForm() {
  const handleClickKakaoLoginButton = () => {
    const { NEXT_PUBLIC_KAKAO_OAUTH_URL, NEXT_PUBLIC_KAKAO_CLIENT_ID } =
      process.env;

    const KAKAO_AUTH_URL = `${NEXT_PUBLIC_KAKAO_OAUTH_URL}/authorize?client_id=${NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${window.location.origin}/login/KAKAO&response_type=code`;

    window.location.replace(KAKAO_AUTH_URL);
  };

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
        onClick={handleClickKakaoLoginButton}
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
