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
import { RegistrationEvent } from '../../events/auth/registration.event';
import { generateAccessToken, generateAuthResult } from './auth.helper';
import { compare, hash } from '../../../lib/bcrypt/bcrypt';
import { getString } from '../../../lib/helpers/resoure.helper';

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

    return await generateAuthResult(user);
  }

  async login(values: LoginValues): Promise<AuthResult> {
    const user = await userResource.service.findOne({
      filter: {
        email: {
          operator: '=',
          value: values.email,
        },
      },
      throwOnNoResult: true,
    });

    if (!(await compare(values.password, user.password))) {
      throw new Error(getString('auth.credential-invalid') as string);
    }

    await refreshTokenResource.service.delete({
      filter: {
        user_id: {
          operator: '=',
          value: user.id,
        },
      },
    });

    return await generateAuthResult(user);
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

    return await generateAccessToken(storedRefreshToken.user);
  }
}
