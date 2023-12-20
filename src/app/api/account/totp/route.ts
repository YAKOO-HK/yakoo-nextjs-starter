import { Secret, TOTP } from 'otpauth';
import { env } from '@/env';
import { responseJson } from '@/lib/api-utils';
import { requireFrontendUser } from '@/lib/auth';
import { withAuthentication } from '@/lib/middleware/authentication';
import { withBodyValidation } from '@/lib/middleware/zod-validation';
import { prisma } from '@/lib/prisma';
import { TotpUpdateSchema, type TotpConfigSchema } from '@/types/totp';

export const GET = withAuthentication('frontend', async function (_req) {
  const dbUser = await requireFrontendUser();
  const secret = new Secret({ size: 20 });
  const config = {
    period: 30,
    digits: 6,
    algorithm: 'sha1',
  } satisfies TotpConfigSchema;
  const totp = new TOTP({
    label: dbUser.username,
    issuer: env.NEXT_PUBLIC_APP_NAME,
    secret,
    ...config,
  });

  return responseJson({ config, secret: secret.hex, url: totp.toString() });
});

export const POST = withAuthentication(
  'frontend',
  withBodyValidation(TotpUpdateSchema, async function (_req, body) {
    const dbUser = await requireFrontendUser();
    await prisma.$transaction([
      prisma.frontendUser.update({ where: { id: dbUser.id }, data: { enableMfa: true } }),
      prisma.frontendUserTotp.upsert({
        create: {
          userId: dbUser.id,
          ...body,
        },
        update: body,
        where: { userId: dbUser.id },
      }),
    ]);
    return responseJson({});
  })
);
