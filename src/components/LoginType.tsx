'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

import { kakaoLogin, googleLogin } from '@/api/login';

export default function LoginType() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const authorizationCode = searchParams.get('code') || '';

  useEffect(() => {
    if (authorizationCode) {
      const type = pathname.split('/')[2];
      if (type === 'kakao') {
        oauthKakaoLogin();
      } else {
        oauthGoogleLogin();
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

  const oauthGoogleLogin = async () => {
    const { data } = await googleLogin({
      authorizationCode,
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',
      redirectUri: `${window.location.origin}/oauth/google`,
      grantType: 'authorization_code',
    });

    if (data) {
      const { accessToken, refershToken, accessTokenExpiresIn } = data;
      console.log(accessToken, refershToken, accessTokenExpiresIn);
    }
  };

  return <></>;
}
