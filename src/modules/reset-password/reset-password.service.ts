import { Service } from 'typedi';
import crypto from 'crypto';
import {
  ForgotPasswordValues,
  ResetPasswordValues,
  StoredResetPassword,
} from './reset-password.entity';
import { userResource } from '../user/user.resource';
import { resetPasswordResource } from './reset-password.resource';
import { getNext, isBefore } from '../../../lib/date/date.helper';
import { sendMail } from '../../../lib/mail/mail';
import { ForgotPasswordMail } from './mail/forgot-password.mail';
import { getString } from '../../../lib/helpers/resoure.helper';
import { hash } from '../../../lib/bcrypt/bcrypt';

@Service()
export class ResetPasswordService {
  async forgotPassword(values: ForgotPasswordValues): Promise<void> {
    const user = await userResource.service.findOne({
      filter: {
        email: {
          operator: '=',
          value: values.email,
        },
      },
      columns: ['id', 'email', 'email'],
      throwOnNoResult: true,
    });

    const storedResetPassword = (await resetPasswordResource.service.store({
      values: {
        user_id: user.id,
        token: crypto.randomBytes(24).toString('hex'),
        expire_at: getNext(1, 'hour'),
      },
      returnCreated: true,
      returnedColumns: ['token'],
    })) as StoredResetPassword;

    await sendMail(
      new ForgotPasswordMail({ user, token: storedResetPassword.token })
    );
  }

  async resetPassword(values: ResetPasswordValues): Promise<void> {
    const storedResetPassword = await resetPasswordResource.service.findOne({
      filter: {
        token: {
          operator: '=',
          value: values.token,
        },
      },
      columns: ['id', 'token', 'user_id', 'expire_at'],
      throwOnNoResult: true,
    });

    if (isBefore(storedResetPassword.expire_at)) {
      throw new Error(
        getString('reset-password.exceptions.token-expired') as string
      );
    }

    await Promise.all([
      userResource.service.update({
        filter: {
          id: {
            operator: '=',
            value: storedResetPassword.user_id,
          },
        },
        values: {
          password: await hash(values.password),
        },
        returnCreated: false,
      }),
      resetPasswordResource.service.delete({
        filter: {
          id: {
            operator: '=',
            value: storedResetPassword.id,
          },
        },
      }),
    ]);
  }
}
