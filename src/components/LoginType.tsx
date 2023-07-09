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
      //TODO: 쿠키/세션/로컬스토리지 저장 후 사용
      //TODO: 로그인 성공 후 페이지 이동
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
      //TODO: 쿠키/세션/로컬스토리지 저장 후 사용
      //TODO: 로그인 성공 후 페이지 이동
    }
  };

  return <></>;
}
