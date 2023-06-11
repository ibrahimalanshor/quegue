import { getNext } from '../../../lib/date/date.helper';
import { generateToken } from '../../../lib/jwt/token';
import { jwtConfig } from '../../config/jwt.config';
import { refreshTokenResource } from '../refresh-token/refresh-token.resource';
import { StoredUser } from '../user/user.entity';
import { AuthResult, AuthToken } from './auth.entity';

export async function genereateRefreshToken(
  user: StoredUser
): Promise<AuthToken> {
  const refreshToken = await generateToken(
    { userId: user.id },
    jwtConfig.refreshTokenSecret,
    { expiresIn: '30m' }
  );
  const res = await refreshTokenResource.service.store({
    values: {
      token: refreshToken,
      user_id: user.id,
      expire_at: getNext(30, 'day'),
    },
    returnCreated: false,
  });

  return refreshToken;
}

export async function generateAccessToken(
  user: StoredUser
): Promise<AuthToken> {
  return await generateToken({ userId: user.id }, jwtConfig.accessTokenSecret, {
    expiresIn: '15m',
  });
}

export async function generateAuthResult(
  user: StoredUser
): Promise<AuthResult> {
  return {
    accessToken: await generateAccessToken(user),
    refreshToken: await genereateRefreshToken(user),
  };
}
