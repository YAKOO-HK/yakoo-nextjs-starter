import { ZodError, ZodIssue } from 'zod';
import { responseJson } from '@/lib/api-utils';
import { withBodyValidation } from '@/lib/middleware/zod-validation';
import { createPasswordHash, verifyPasswordResetToken } from '@/lib/password';
import { prisma } from '@/lib/prisma';
import { ResetPasswordSchema } from '@/types/user';

export const POST = withBodyValidation(ResetPasswordSchema, async (req, body) => {
  const { token, password } = body;
  if (!verifyPasswordResetToken(token)) {
    throw new ZodError([{ path: ['token'], message: 'Invalid token' }] as ZodIssue[]);
  }
  const adminUser = await prisma.adminUser.findFirst({ where: { passwordResetToken: token, status: 10 } });
  if (!adminUser) {
    throw new ZodError([{ path: ['token'], message: 'Invalid token' }] as ZodIssue[]);
  }

  await prisma.adminUser.update({
    where: { id: adminUser.id },
    data: {
      passwordHash: createPasswordHash(password),
      passwordResetToken: null,
    },
  });

  return responseJson(null, { status: 200 });
});
