import { Mail } from '../../../../lib/mail/mail';
import { getString } from '../../../../lib/helpers/resoure.helper';
import { serverConfig } from '../../../config/server.config';
import { StoredUser } from '../../user/user.entity';

export class VerificationMail extends Mail {
  constructor(data: { user: StoredUser; token: string }) {
    super();

    this.to = data.user.email;
    this.subject = getString('verification.mail.subject') as string;
    this.text = getString('verification.mail.content') as string;
    this.template = 'verification/verification.pug';
    this.templateData = {
      title: getString('verification.mail.title') as string,
      message: getString('verification.mail.content') as string,
      greet: getString('verification.mail.greet') as string,
      user: data.user,
      link: {
        url: `${serverConfig.baseUrl}/api/auth/verify/${data.token}`,
        text: getString('verification.mail.link') as string,
      },
    };
  }
}
