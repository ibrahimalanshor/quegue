export const mailConfig = {
  host: process.env.MAIL_HOST as string,
  port: +(process.env.MAIL_PORT || 2525) as number,
  user: process.env.MAIL_USER as string,
  password: process.env.MAIL_PASSWORD as string,
  from: process.env.MAIL_FROM as string,
};
