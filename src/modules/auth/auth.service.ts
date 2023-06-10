import { generateToken } from '../../../lib/jwt/token';
import { jwtConfig } from '../../config/jwt.config';
import { StoredUser } from '../user/user.entity';
import {
  AuthResult,
  AuthToken,
  LoginValues,
  RefreshTokenValues,
  RegisterValues,
} from './auth.entity';
import { userResource } from '../user/user.resource';
import { refreshTokenResource } from '../refresh-token/refresh-token.resource';
import { Service } from 'typedi';
import { RegisterException } from '../../exceptions/auth/register.exception';
import { registeredEvent } from '../../events/auth/registered.event';

@Service()
export class AuthGeneratorService {
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

  async generateAccessToken(user: StoredUser): Promise<AuthToken> {
    return await generateToken(
      { userId: user.id },
      jwtConfig.accessTokenSecret,
      { expiresIn: '15m' }
    );
  }

  async generateAuthResult(user: StoredUser): Promise<AuthResult> {
    return {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.genereateRefreshToken(user),
    };
  }
}

@Service()
export class AuthService {
  constructor(public authGeneratorService: AuthGeneratorService) {}

  // dispatch registered event to send email
  // catch unique error
  async register(values: RegisterValues): Promise<AuthResult> {
    try {
      const user = await userResource.service.store(values, {
        returnedColumns: ['id', 'email', 'username'],
      });

      registeredEvent.emit('registered', user);

      return await this.authGeneratorService.generateAuthResult(user);
    } catch (err) {
      throw new RegisterException(err);
    }
  }

  // catch not found error
  async login(values: LoginValues): Promise<AuthResult> {
    const user = await userResource.service.findOne({
      filter: {
        email: {
          operator: '=',
          value: values.email,
        },
      },
    });

    await refreshTokenResource.service.delete({
      filter: {
        user_id: {
          operator: '=',
          value: user.id,
        },
      },
    });

    return await this.authGeneratorService.generateAuthResult(user);
  }

  // catch not found error
  async logout(refreshTokenValues: RefreshTokenValues) {
    await refreshTokenResource.service.delete({
      filter: {
        token: {
          operator: '=',
          value: refreshTokenValues.token,
        },
      },
    });
  }

  // catch not found error
  // join user
  async refreshToken(
    refreshTokenValues: RefreshTokenValues
  ): Promise<AuthToken> {
    const storedRefreshToken = await refreshTokenResource.service.findOne({
      filter: {
        token: {
          operator: '=',
          value: refreshTokenValues.token,
        },
      },
    });

    return await this.authGeneratorService.generateAccessToken(
      storedRefreshToken.user
    );
  }
}
