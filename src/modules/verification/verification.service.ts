import { Service } from 'typedi';
import crypto from 'crypto';
import { getNext, isBefore } from '../../../lib/date/date.helper';
import { getString } from '../../../lib/string/string-resource';
import { userResource } from '../user/user.resource';
import {
  ResendVerifyUserValues,
  VerifyUserValues,
} from './verification.entity';
import { verificationResource } from './verification.resource';
import { sendMail } from '../../../lib/mail/mail';
import { StoredUser } from '../user/user.entity';
import { VerificationMail } from './mail/verification.mail';
import { ResendVerificationException } from './exceptions/resend-verification.exception';
import { VerifyException } from './exceptions/verify.exception';

@Service()
export class VerificationService {
  async sendVerification(user: StoredUser): Promise<void> {
    const token = crypto.randomBytes(24).toString('hex');

    await verificationResource.service.store({
      values: {
        token,
        user_id: user.id,
        expire_at: getNext(1, 'hour'),
      },
      returning: false,
    });

    await sendMail(new VerificationMail({ user, token }));
  }

  async resendVerification(values: ResendVerifyUserValues): Promise<void> {
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
      throw new ResendVerificationException(
        new Error(
          getString('verification.exepctions.email-already-verified') as string
        )
      );
    }

    await this.sendVerification(user);
  }
  async verify(verifyValues: VerifyUserValues): Promise<void> {
    const storedVerification = await verificationResource.service.findOne({
      filter: {
        token: {
          operator: '=',
          value: verifyValues.token,
        },
      },
      columns: ['id', 'expire_at', 'user_id'],
      throwOnNoResult: true,
    });

    if (isBefore(storedVerification.expire_at)) {
      throw new VerifyException(
        new Error(getString('verification.exepctions.token-expired') as string)
      );
    }

    await Promise.all([
      userResource.service.update({
        values: {
          verified_at: new Date(),
        },
        filter: {
          id: {
            operator: '=',
            value: storedVerification.user_id,
          },
        },
        force: true,
        returning: false,
      }),
      verificationResource.service.delete({
        filter: {
          id: {
            operator: '=',
            value: storedVerification.id,
          },
        },
      }),
    ]);
  }
}
