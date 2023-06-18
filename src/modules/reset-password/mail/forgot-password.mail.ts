import { Mail } from '../../../../lib/mail/mail';
import { getString } from '../../../../lib/string/string-resource';
import { StoredUser } from '../../user/user.entity';
import appConfig from '../../../config/app.config';

export class ForgotPasswordMail extends Mail {
  constructor(data: { user: StoredUser; token: string }) {
    super();

    this.to = data.user.email;
    this.subject = getString(
      'reset-password.mail.forgot-password.subject'
    ) as string;
    this.text = getString(
      'reset-password.mail.forgot-password.content'
    ) as string;
    this.template = 'reset-password/forgot-password.pug';
    this.templateData = {
      title: getString('reset-password.mail.forgot-password.title') as string,
      message: getString(
        'reset-password.mail.forgot-password.content'
      ) as string,
      greet: getString('reset-password.mail.forgot-password.greet') as string,
      user: data.user,
      link: {
        url: `${appConfig.resetPasswordUrl}/${data.token}`,
        text: getString('reset-password.mail.forgot-password.link') as string,
      },
    };
  }
}
