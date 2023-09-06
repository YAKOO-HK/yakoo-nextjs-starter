import { ZodError, ZodIssue } from 'zod';
import { responseJson } from '@/lib/api-utils';
import { withBodyValidation } from '@/lib/middleware/zod-validation';
import { createPasswordHash, verifyPasswordResetToken } from '@/lib/password';
import { prisma } from '@/lib/prisma';
import { ResetPasswordSchema } from '@/types/user';

export const POST = withBodyValidation(ResetPasswordSchema, async (_req, body) => {
  const { token, password } = body;
  if (!verifyPasswordResetToken(token)) {
    throw new ZodError([{ path: ['token'], message: 'Invalid token' }] as ZodIssue[]);
  }
  const user = await prisma.frontendUser.findFirst({ where: { passwordResetToken: token, status: 10 } });
  if (!user) {
    throw new ZodError([{ path: ['token'], message: 'Invalid token' }] as ZodIssue[]);
  }

  await prisma.frontendUser.update({
    where: { id: user.id },
    data: {
      passwordHash: createPasswordHash(password),
      passwordResetToken: null,
    },
  });

  return responseJson(null, { status: 200 });
});
