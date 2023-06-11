import crypto from 'crypto';
import { EventEmitter } from '../../../lib/event/event';
import { StoredUser } from '../../modules/user/user.entity';
import { verificationTokenResource } from '../../modules/verification-token/verification-token.resource';
import { getString } from '../../../lib/helpers/resoure.helper';
import { sendMail } from '../../../lib/mail/mail';
import { serverConfig } from '../../config/server.config';
import { getNext } from '../../../lib/date/date.helper';

const RegistrationEvent = new EventEmitter();

RegistrationEvent.on('registered', async (user: StoredUser) => {
  const token = crypto.randomBytes(24).toString('hex');

  const res = await verificationTokenResource.service.store({
    values: {
      token,
      user_id: user.id,
      expire_at: getNext(1, 'hour'),
    },
    returnCreated: false,
  });

  await sendMail({
    to: user.email,
    subject: getString('auth.mail.verification-subject') as string,
    text: getString('auth.mail.verification-content') as string,
    template: 'auth/verification.pug',
    templateData: {
      title: getString('auth.mail.verification-title') as string,
      message: getString('auth.mail.verification-content') as string,
      greet: getString('auth.mail.verification-greet') as string,
      user,
      link: {
        url: `${serverConfig.baseUrl}/api/auth/verify/${token}`,
        text: getString('auth.mail.verification-link') as string,
      },
    },
  });
});

export { RegistrationEvent };
