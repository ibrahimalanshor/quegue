import nodemailer from 'nodemailer';
import path from 'path';
import { mailConfig } from '../../src/config/mail.config';
import { renderFile } from 'pug';
import appConfig from '../../src/config/app.config';

export class Mail {
  to: string;
  subject: string;
  text: string;
  template: string;
  templateData: Record<string, any>;
}

export async function sendMail(mail: Mail) {
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
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    html: renderFile(
      path.resolve(__dirname, `../../src/templates/mail/${mail.template}`),
      {
        ...mail.templateData,
        from: {
          url: appConfig.url,
          name: appConfig.name,
        },
      }
    ),
  });
}
