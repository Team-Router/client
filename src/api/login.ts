import { postFetch } from './common';

interface PostLoginParam {
  authorizationCode: string;
  clientId: string;
  redirectUri: string;
  grantType: string;
}

export const login = ({
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
