import { Service } from 'typedi';
import crypto from 'crypto';
import {
  ForgotPasswordValues,
  StoredResetPassword,
} from './reset-password.entity';
import { userResource } from '../user/user.resource';
import { resetPasswordResource } from './reset-password.resource';
import { getNext } from '../../../lib/date/date.helper';
import { sendMail } from '../../../lib/mail/mail';
import { ForgotPasswordMail } from './mail/forgot-password.mail';

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
}
