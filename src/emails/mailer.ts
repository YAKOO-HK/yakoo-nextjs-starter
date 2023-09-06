import mailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { env } from '@/env';
import 'server-only';
import type { Address } from 'nodemailer/lib/mailer';

export function getDefaultMailer() {
  const transporter = mailer.createTransport(
    {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_AUTH_SECURE,
      auth: env.SMTP_NO_AUTH
        ? undefined
        : {
            type: 'LOGIN',
            user: env.SMTP_USERNAME ?? '',
            pass: env.SMTP_PASSWORD ?? '',
          },
    } satisfies SMTPTransport.Options,
    {
      from: getDefaultFrom(),
    }
  );

  return transporter;
}

export function getDefaultFrom(): string | Address {
  if (env.SMTP_DEFAULT_FROM_NAME) {
    return {
      name: env.SMTP_DEFAULT_FROM_NAME,
      address: env.SMTP_DEFAULT_FROM_ADDRESS,
    } satisfies Address;
  }
  return env.SMTP_DEFAULT_FROM_ADDRESS;
}
