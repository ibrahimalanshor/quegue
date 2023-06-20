import { getNext } from '../../../lib/date/date.helper';
import { generateToken } from '../../../lib/jwt/token';
import { jwtConfig } from '../../config/jwt.config';
import { refreshTokenResource } from '../refresh-token/refresh-token.resource';
import { AuthPayload, AuthResult, AuthToken } from './auth.entity';

export async function genereateRefreshToken(
  payload: AuthPayload
): Promise<AuthToken> {
  const refreshToken = await generateToken(
    { user_id: payload.user_id },
    jwtConfig.refreshTokenSecret,
    { expiresIn: '30m' }
  );
  const res = await refreshTokenResource.service.store({
    values: {
      token: refreshToken,
      user_id: payload.user_id,
      expire_at: getNext(30, 'day'),
    },
    returning: false,
  });

  return refreshToken;
}

export async function generateAccessToken(
  payload: AuthPayload
): Promise<AuthToken> {
  return await generateToken(
    { user_id: payload.user_id },
    jwtConfig.accessTokenSecret,
    {
      expiresIn: '15m',
    }
  );
}

export async function generateAuthResult(
  payload: AuthPayload
): Promise<AuthResult> {
  return {
    accessToken: await generateAccessToken(payload),
    refreshToken: await genereateRefreshToken(payload),
  };
}
