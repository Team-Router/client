import { postFetch } from './common';

interface PostLoginParam {
  authorizationCode: string;
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  grantType: string;
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
  });
};

export const googleLogin = ({
  authorizationCode,
  clientId,
  clientSecret,
  redirectUri,
  grantType,
}: PostLoginParam) => {
  return postFetch('/oauth/kakao', {
    authorizationCode,
    clientId,
    clientSecret,
    redirectUri,
    grantType,
  });
};
