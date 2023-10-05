import { Totp } from 'time2fa';
import { env } from '@/env';
import { responseJson } from '@/lib/api-utils';
import { requireFrontendUser } from '@/lib/auth';
import { withAuthentication } from '@/lib/middleware/authentication';
import { withBodyValidation } from '@/lib/middleware/zod-validation';
import { prisma } from '@/lib/prisma';
import { TotpUpdateSchema } from '@/types/totp';

export const GET = withAuthentication('frontend', async function (_req) {
  const dbUser = await requireFrontendUser();
  const { config, secret, url } = Totp.generateKey(
    { issuer: env.NEXT_PUBLIC_SITE_URL, user: dbUser.username },
    { secretSize: 20, period: 30, digits: 6, algo: 'sha1' } // Note: Google Authenticator only supports sha1 and 30s period
  );
  return responseJson({ config, secret, url });
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
