import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /*
   * Server-side Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    // Database (Prisma)
    DATABASE_URL: z.string().url(),
    // NextAuth
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(16),
    // hCaptcha
    HCAPTCHA_SECRET: z.string().min(1).default('0x0000000000000000000000000000000000000000'),
    HCAPTCHA_VERIFY_URL: z.string().url().default('https://hcaptcha.com/siteverify'),
    HCAPTCHA_SCORE_THRESHOLD: z.coerce.number().min(0).max(1).default(0.5),
    // SMTP_OPTIONS
    SMTP_DEFAULT_FROM_NAME: z.string().trim().optional(),
    SMTP_DEFAULT_FROM_ADDRESS: z.string().trim().email(),
    SMTP_HOST: z.string().min(1).default('localhost'),
    SMTP_PORT: z.coerce.number().int().positive().default(25),
    SMTP_NO_AUTH: z
      .enum(['true', 'false'])
      .default('false')
      .transform((v) => v === 'true'),
    SMTP_AUTH_SECURE: z
      .enum(['true', 'false'])
      .default('false')
      .transform((v) => v === 'true'),
    SMTP_USERNAME: z.string().nullish(),
    SMTP_PASSWORD: z.string().nullish(),
    // SAML2
    SAML_ENABLED: z
      .enum(['true', 'false'])
      .default('false')
      .transform((v) => v === 'true'),
    SAML_SP_CERT_PATH: z.string().trim().default('./saml2/mock-sp-cert.pem'),
    SAML_SP_PRIVATE_KEY_PATH: z.string().trim().default('./saml2/mock-sp-private-key.pem'),
    SAML_SP_PRIVATE_KEY_PASS: z.string().optional(),
    SAML_IDP_METADATA_PATH: z.string().trim().default('./saml2/mock-idp-metadata.xml'),
    // App Params
    PASSWORD_RESET_TOKEN_EXPIRE_IN_DAYS: z.coerce.number().int().positive(),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    // NextAuth
    NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_APP_NAME: z.string().trim().default('Yakoo Next.js Starter'),
    // hCaptcha
    NEXT_PUBLIC_HCAPTCHA_SITEKEY: z.string().min(1).default('10000000-ffff-ffff-ffff-000000000001'),
    // GA
    NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID: z.string().trim().nullish(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    HCAPTCHA_SECRET: process.env.HCAPTCHA_SECRET,
    HCAPTCHA_VERIFY_URL: process.env.HCAPTCHA_VERIFY_URL,
    HCAPTCHA_SCORE_THRESHOLD: process.env.HCAPTCHA_SCORE_THRESHOLD,
    SMTP_DEFAULT_FROM_NAME: process.env.SMTP_DEFAULT_FROM_NAME,
    SMTP_DEFAULT_FROM_ADDRESS: process.env.SMTP_DEFAULT_FROM_ADDRESS,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_NO_AUTH: process.env.SMTP_NO_AUTH,
    SMTP_AUTH_SECURE: process.env.SMTP_AUTH_SECURE,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SAML_ENABLED: process.env.SAML_ENABLED,
    SAML_SP_CERT_PATH: process.env.SAML_SP_CERT_PATH,
    SAML_SP_PRIVATE_KEY_PATH: process.env.SAML_SP_PRIVATE_KEY_PATH,
    SAML_SP_PRIVATE_KEY_PASS: process.env.SAML_SP_PRIVATE_KEY_PASS,
    SAML_IDP_METADATA_PATH: process.env.SAML_IDP_METADATA_PATH,
    PASSWORD_RESET_TOKEN_EXPIRE_IN_DAYS: process.env.PASSWORD_RESET_TOKEN_EXPIRE_IN_DAYS,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_HCAPTCHA_SITEKEY: process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID,
  },
  emptyStringAsUndefined: true,
});
