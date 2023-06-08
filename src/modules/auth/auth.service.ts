import { generateToken } from '../../../lib/jwt/token';
import { jwtConfig } from '../../config/jwt.config';
import { StoredUser } from '../user/user.entity';
import {
  AuthResult,
  AuthToken,
  LoginValues,
  RegisterValues,
} from './auth.entity';
import { AuthRepository } from './auth.repository';
import { userResource } from '../user/user.resource';
import { refreshTokenResource } from '../refresh-token/refresh-token.resource';

export class AuthService {
  constructor(public authRepository: AuthRepository) {}

  async genereateRefreshToken(user: StoredUser): Promise<AuthToken> {
    const refreshToken = await generateToken(
      { userId: user.id },
      jwtConfig.refreshTokenSecret,
      { expiresIn: '30m' }
    );
    await refreshTokenResource.service.store({
      token: refreshToken,
      user_id: user.id,
    });

    return refreshToken;
  }

  async generateAuthResult(user: StoredUser): Promise<AuthResult> {
    const refreshToken = await generateToken(
      { userId: user.id },
      jwtConfig.refreshTokenSecret,
      { expiresIn: '30m' }
    );

    return {
      accessToken: await generateToken(
        { userId: user.id },
        jwtConfig.accessTokenSecret,
        { expiresIn: '15m' }
      ),
      refreshToken,
    };
  }

  async register(values: RegisterValues): Promise<AuthResult> {
    const user = await userResource.service.store(values);

    return await this.generateAuthResult(user);
  }

  async login(values: LoginValues): Promise<AuthResult> {
    const user = await userResource.service.findOne({
      filter: {
        email: {
          operator: '=',
          value: values.email,
        },
      },
    });

    return await this.generateAuthResult(user);
  }
}
