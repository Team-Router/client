'use client';
import Image from 'next/image';
import React from 'react';

export default function LoginForm() {
  const handleClickKakaoLoginButton = () => {
    const KAKAO_AUTH_URL = `${process.env.NEXT_PUBLIC_KAKAO_OAUTH_URL}/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${window.location.origin}/oauth/kakao&response_type=code`;

    window.location.replace(KAKAO_AUTH_URL);
  };

  const handleClickGoogleLoginButton = () => {
    const GOOGLE_AUTH_URL = `${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL}/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/oauth/google&response_type=code&scope=profile`;
    window.location.replace(GOOGLE_AUTH_URL);
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
          카카오 계정으로 로그인
        </p>
      </button>
      <button
        aria-label="google-login-button"
        style={{
          width: '100%',
          height: '48px',
          display: 'flex',
          justifyItems: 'center',
          alignItems: 'center',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: '#FFFFFF',
          cursor: 'pointer',
        }}
        onClick={handleClickGoogleLoginButton}
      >
        <Image
          src="/google.svg"
          alt="google-symbol"
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
          구글 계정으로 로그인
        </p>
      </button>
    </>
  );
}
