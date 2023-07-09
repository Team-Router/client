'use client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

import { kakaoLogin } from '@/api/login';

export default function LoginType() {
  const searchParams = useSearchParams();
  const authorizationCode = searchParams.get('code') || '';

  useEffect(() => {
    if (authorizationCode) {
      try {
        oauthKakaoLogin();
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const oauthKakaoLogin = async () => {
    const { data } = await kakaoLogin({
      authorizationCode,
      clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '',
      redirectUri: `${window.location.origin}/oauth/kakao`,
      grantType: 'authorization_code',
    });

    if (data) {
      const { accessToken, refershToken, accessTokenExpiresIn } = data;
      console.log(accessToken, refershToken, accessTokenExpiresIn);
    }
  };

  // const oauthGoogleLogin = async () => {};

  return <div>KakaoLogin</div>;
}
