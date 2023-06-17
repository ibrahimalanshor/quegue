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
import { generateAccessToken, generateAuthResult } from './auth.helper';
import { compare, hash } from '../../../lib/bcrypt/bcrypt';
import { getString } from '../../../lib/helpers/resoure.helper';
import { isBefore } from '../../../lib/date/date.helper';
import { RegistrationEvent } from './events/registration.event';
import { LoginException } from './exceptions/login.exception';
import { RefreshTokenException } from './exceptions/refresh-token.exception';

@Service()
export class AuthService {
  async register(values: RegisterValues): Promise<AuthResult> {
    const user = (await userResource.service.store({
      values: {
        ...values,
        password: await hash(values.password),
      },
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
}
