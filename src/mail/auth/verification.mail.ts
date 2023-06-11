import { getString } from '../../../lib/helpers/resoure.helper';
import { Mail } from '../../../lib/mail/mail';
import { serverConfig } from '../../config/server.config';
import { StoredUser } from '../../modules/user/user.entity';

export class VerificationMail extends Mail {
  constructor(data: { user: StoredUser; token: string }) {
    super();

    this.to = data.user.email;
    this.subject = getString('auth.mail.verification-subject') as string;
    this.text = getString('auth.mail.verification-content') as string;
    this.template = 'auth/verification.pug';
    this.templateData = {
      title: getString('auth.mail.verification-title') as string,
      message: getString('auth.mail.verification-content') as string,
      greet: getString('auth.mail.verification-greet') as string,
      user: data.user,
      link: {
        url: `${serverConfig.baseUrl}/api/auth/verify/${data.token}`,
        text: getString('auth.mail.verification-link') as string,
      },
    };
  }
}
