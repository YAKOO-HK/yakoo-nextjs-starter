import { ZodError } from 'zod';
import { getDefaultMailer } from '@/emails/mailer';
import { getForgotPasswordEmail } from '@/emails/user/forgot-password';
import { responseJson } from '@/lib/api-utils';
import { verifyCaptcha } from '@/lib/hCaptcha';
import { withBodyValidation } from '@/lib/middleware/zod-validation';
import { createPasswordResetToken } from '@/lib/password';
import { prisma } from '@/lib/prisma';
import { RequestPasswordResetSchema } from '@/types/user';
import 'server-only';

export const POST = withBodyValidation(RequestPasswordResetSchema, async (_req, body) => {
  const { email, hCaptcha } = body;
  if (!verifyCaptcha(hCaptcha)) {
    throw new ZodError([{ code: 'custom', path: ['email'], message: 'Invalid CAPTCHA.' }]);
  }

  let user = await prisma.frontendUser.findFirst({ where: { email, status: 10 } });
  if (!user) {
    // Email not found, but we don't want to leak that information
    // return responseJson(null, { status: 200 });
    throw new ZodError([{ code: 'custom', path: ['email'], message: 'Invalid email.' }]);
  }

  const passwordResetToken = createPasswordResetToken();
  user = await prisma.frontendUser.update({
    where: { id: user.id },
    data: { passwordResetToken },
  });

  await getDefaultMailer().sendMail({
    to: email,
    ...getForgotPasswordEmail({ user, passwordResetToken }),
  });

  return responseJson(null, { status: 200 });
});
