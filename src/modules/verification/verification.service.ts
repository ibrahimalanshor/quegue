import { Service } from 'typedi';
import crypto from 'crypto';
import { getNext, isBefore } from '../../../lib/date/date.helper';
import { getString } from '../../../lib/helpers/resoure.helper';
import { userResource } from '../user/user.resource';
import {
  ResendVerifyUserValues,
  VerifyUserValues,
} from './verification-token.entity';
import { verificationTokenResource } from './verification-token.resource';
import { sendMail } from '../../../lib/mail/mail';
import { StoredUser } from '../user/user.entity';
import { VerificationMail } from '../../mail/auth/verification.mail';

@Service()
export class VerificationService {
  async sendVerification(user: StoredUser): Promise<void> {
    const token = crypto.randomBytes(24).toString('hex');

    await verificationTokenResource.service.store({
      values: {
        token,
        user_id: user.id,
        expire_at: getNext(1, 'hour'),
      },
      returnCreated: false,
    });

    await sendMail(new VerificationMail({ user, token }));
  }

  async resendVerification(values: ResendVerifyUserValues): Promise<void> {
    console.log(values);
    const user = await userResource.service.findOne({
      filter: {
        email: {
          operator: '=',
          value: values.email,
        },
      },
      columns: ['id', 'email', 'verified_at'],
      throwOnNoResult: true,
    });

    if (user.verified_at) {
      throw new Error(getString('auth.email-already-verified') as string);
    }

    await this.sendVerification(user);
  }
  async verify(verifyValues: VerifyUserValues): Promise<void> {
    const storedVerificationToken =
      await verificationTokenResource.service.findOne({
        filter: {
          token: {
            operator: '=',
            value: verifyValues.token,
          },
        },
        columns: ['id', 'expire_at', 'user_id'],
        throwOnNoResult: true,
      });

    if (isBefore(storedVerificationToken.expire_at)) {
      throw new Error(getString('auth.token-expired') as string);
    }

    await Promise.all([
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
  }
}
