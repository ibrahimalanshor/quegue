import { StoredUser } from '../user/user.entity';
import {
  AuthResult,
  AuthToken,
  LoginValues,
  RefreshTokenValues,
  RegisterValues,
  VerifyUserValues,
} from './auth.entity';
import { userResource } from '../user/user.resource';
import { refreshTokenResource } from '../refresh-token/refresh-token.resource';
import { Service } from 'typedi';
import { RegistrationEvent } from '../../events/auth/registration.event';
import { verificationTokenResource } from '../verification-token/verification-token.resource';
import { getNext, isBefore } from '../../../lib/date/date.helper';
import { getString } from '../../../lib/helpers/resoure.helper';
import { generateAccessToken, generateAuthResult } from './auth.helper';
import { VerifyException } from '../../exceptions/auth/verify.exception';

@Service()
export class AuthService {
  async register(values: RegisterValues): Promise<AuthResult> {
    const user = (await userResource.service.store({
      values,
      returnedColumns: ['id', 'email', 'username'],
    })) as StoredUser;

    await RegistrationEvent.emit('registered', user);

    return await generateAuthResult(user);
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

    return await generateAuthResult(user);
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

    return await generateAccessToken(storedRefreshToken.user);
  }

  async verifyUser(verifyUserValues: VerifyUserValues): Promise<void> {
    try {
      const storedVerificationToken =
        await verificationTokenResource.service.findOne({
          filter: {
            token: {
              operator: '=',
              value: verifyUserValues.token,
            },
          },
          columns: ['id', 'expire_at', 'user_id'],
          throwOnNoResult: true,
        });

      if (isBefore(storedVerificationToken.expire_at)) {
        throw new Error(getString('auth.token-expired') as string);
      }

      const res = await Promise.all([
        userResource.service.update({
          values: {
            verified_at: new Date(),
          },
          filter: {
            id: {
              operator: '=',
              value: storedVerificationToken.user_id,
            },
          },
          force: true,
          returnCreated: false,
        }),
        verificationTokenResource.service.delete({
          filter: {
            id: {
              operator: '=',
              value: storedVerificationToken.id,
            },
          },
        }),
      ]);
    } catch (err) {
      throw new VerifyException(err);
    }
  }
}
