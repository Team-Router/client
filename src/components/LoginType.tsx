'use client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

import { login } from '@/api/login';

export default function LoginType() {
  const searchParams = useSearchParams();
  const authorizationCode = searchParams.get('code') || '';

  useEffect(() => {
    if (authorizationCode) {
      try {
        oauthLogin();
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const oauthLogin = async () => {
    const data = await login({
      authorizationCode,
      clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '',
      redirectUri: `${window.location.origin}/oauth/kakao`,
      grantType: 'authorization_code',
    });

    if (data) {
      const { accessToken, refershToken, accessTokenExpiresIn } = data;
      // 토큰 저장

      console.log(accessToken, refershToken, accessTokenExpiresIn);
    }
  };

  return <div>KakaoLogin</div>;
}
