import { StoredUser } from '../user/user.entity';
import {
  AuthResult,
  AuthToken,
  GoogleAuthValues,
  LoginValues,
  RefreshTokenValues,
  RegisterOptions,
} from './auth.entity';
import { userResource } from '../user/user.resource';
import { refreshTokenResource } from '../refresh-token/refresh-token.resource';
import { Service } from 'typedi';
import { generateAccessToken, generateAuthResult } from './auth.helper';
import { compare, hash } from '../../../lib/bcrypt/bcrypt';
import { getString } from '../../../lib/helpers/resoure.helper';
import { getNow, isBefore } from '../../../lib/date/date.helper';
import { RegistrationEvent } from './events/registration.event';
import { LoginException } from './exceptions/login.exception';
import { RefreshTokenException } from './exceptions/refresh-token.exception';
import { getGoogleUserInfo } from '../../../lib/google/google.helper';
import { randomString } from '../../../lib/string/string.helper';

@Service()
export class AuthService {
  async register(options: RegisterOptions): Promise<AuthResult> {
    const user = (await userResource.service.store({
      values: {
        email: options.values.email,
        username: options.values.username,
        name: options.values.name,
        password: await hash(options.values.password),
        verified_at: options.verified ? getNow() : null,
      },
      force: true,
      returnedColumns: ['id', 'email', 'username'],
    })) as StoredUser;

    await RegistrationEvent.emit('registered', user);

    return await generateAuthResult({
      user_id: user.id,
    });
  }

  async login(values: LoginValues): Promise<AuthResult> {
    const user = await userResource.service.findOne({
      filter: {
        email: {
          operator: '=',
          value: values.email,
        },
      },
      columns: ['id', 'password'],
      throwOnNoResult: true,
    });

    if (!(await compare(values.password, user.password))) {
      throw new LoginException(
        new Error(getString('auth.exceptions.credential-invalid') as string)
      );
    }

    await refreshTokenResource.service.delete({
      filter: {
        user_id: {
          operator: '=',
          value: user.id,
        },
      },
    });

    return await generateAuthResult({
      user_id: user.id,
    });
  }

  async logout(refreshTokenValues: RefreshTokenValues) {
    await refreshTokenResource.service.delete({
      filter: {
        token: {
          operator: '=',
          value: refreshTokenValues.token,
        },
      },
      throwOnNoAffected: true,
    });
  }

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
      columns: ['user_id', 'expire_at'],
      throwOnNoResult: true,
    });

    if (isBefore(storedRefreshToken.expire_at)) {
      throw new RefreshTokenException(
        new Error(getString('auth.exceptions.token-expired') as string)
      );
    }

    return await generateAccessToken({
      user_id: storedRefreshToken.user_id,
    });
  }

  async googleAuth(values: GoogleAuthValues): Promise<AuthResult> {
    const googleUserInfo = await getGoogleUserInfo({
      id_token: values.id_token,
      access_token: values.access_token,
    });

    const storedUser = await userResource.service.findOne({
      filter: {
        email: {
          operator: '=',
          value: googleUserInfo.email,
        },
      },
      columns: ['id'],
      throwOnNoResult: false,
    });

    if (!storedUser) {
      return await this.register({
        values: {
          email: googleUserInfo.email,
          name: googleUserInfo.name,
          username: googleUserInfo.name,
          password: randomString(10),
        },
        verified: true,
      });
    }

    return await generateAuthResult({ user_id: storedUser.id });
  }
}
