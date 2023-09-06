import { ZodError } from 'zod';
import { responseJson } from '@/lib/api-utils';
import { requireFrontendUser } from '@/lib/auth';
import { withAuthentication } from '@/lib/middleware/authentication';
import { withBodyValidation } from '@/lib/middleware/zod-validation';
import { createPasswordHash, verifyPassword } from '@/lib/password';
import { prisma } from '@/lib/prisma';
import { ChangePasswordSchema } from '@/types/user';

export const POST = withAuthentication(
  'frontend',
  withBodyValidation(ChangePasswordSchema, async (_req, body) => {
    const { id } = await requireFrontendUser();
    const dbUser = await prisma.frontendUser.findUnique({ where: { id } });
    if (!verifyPassword(body.currentPassword, dbUser?.passwordHash ?? '')) {
      throw new ZodError([{ code: 'custom', path: ['currentPassword'], message: 'Current password is incorrect' }]);
    }
    await prisma.frontendUser.update({
      where: { id },
      data: {
        passwordHash: createPasswordHash(body.password),
        passwordResetToken: null,
      },
    });
    return responseJson({ message: 'Password updated.' }, { status: 200 });
  })
);
