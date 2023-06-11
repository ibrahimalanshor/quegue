import nodemailer from 'nodemailer';
import path from 'path';
import { mailConfig } from '../../src/config/mail.config';
import { renderFile } from 'pug';
import appConfig from '../../src/config/app.config';

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  template: string;
  templateData: Record<string, any>;
}

export async function sendMail(options: MailOptions) {
  const transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    auth: {
      user: mailConfig.user,
      pass: mailConfig.password,
    },
  });

  await transporter.sendMail({
    from: mailConfig.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: renderFile(
      path.resolve(__dirname, `../../src/mail/${options.template}`),
      {
        ...options.templateData,
        from: {
          url: appConfig.url,
          name: appConfig.name,
        },
      }
    ),
  });
}
