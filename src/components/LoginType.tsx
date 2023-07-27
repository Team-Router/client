'use client';
import { redirect, usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { kakaoLogin, googleLogin } from '@/api/login';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function LoginType() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const authorizationCode = searchParams.get('code') || '';
  const router = useRouter();

  const [accessToken, setAccessToken] = useLocalStorage('accessToken', null);
  const [refreshToken, setRefreshToken] = useLocalStorage('refreshToken', null);

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
    try {
      const data = await kakaoLogin({
        authorizationCode,
        clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '',
        redirectUri: `${window.location.origin}/oauth/kakao`,
        grantType: 'authorization_code',
      });

      if (data) {
        const { accessToken, refreshToken } = data;

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);

        router.push('/');
        return;
      } else {
        //TODO: 다시 로그인해달라는 Alert 띄우기
        redirect('/oauth');
      }
    } catch (e) {
      //TODO: 다시 로그인해달라는 Alert 띄우기
      redirect('/oauth');
    }
  };

  const oauthGoogleLogin = async () => {
    try {
      const data = await googleLogin({
        authorizationCode,
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',
        redirectUri: `${window.location.origin}/oauth/google`,
        grantType: 'authorization_code',
      });
      if (data) {
        const { accessToken, refreshToken } = data;

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);

        router.push('/');
      } else {
        //TODO: 다시 로그인해달라는 Alert 띄우기
        redirect('/oauth');
      }
    } catch (e) {
      //TODO: 다시 로그인해달라는 Alert 띄우기
      redirect('/oauth');
    }
  };

  return <></>;
}
