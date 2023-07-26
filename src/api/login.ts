import { postFetch } from './common';

interface PostLoginParam {
  authorizationCode: string;
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  grantType: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const kakaoLogin = ({
  authorizationCode,
  clientId,
  redirectUri,
  grantType,
}: PostLoginParam) => {
  return postFetch('/oauth/kakao', {
    authorizationCode,
    clientId,
    redirectUri,
    grantType,
  }) as Promise<LoginResponse>;
};

export const googleLogin = ({
  authorizationCode,
  clientId,
  clientSecret,
  redirectUri,
  grantType,
}: PostLoginParam) => {
  return postFetch('/oauth/google', {
    authorizationCode,
    clientId,
    clientSecret,
    redirectUri,
    grantType,
  }) as Promise<LoginResponse>;
};
