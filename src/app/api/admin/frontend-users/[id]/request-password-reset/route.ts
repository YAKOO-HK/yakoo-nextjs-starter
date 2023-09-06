import { getDefaultMailer } from '@/emails/mailer';
import { getForgotPasswordEmail } from '@/emails/user/forgot-password';
import { env } from '@/env';
import { responseJson } from '@/lib/api-utils';
import { withAuthentication } from '@/lib/middleware/authentication';
import { createPasswordResetToken } from '@/lib/password';
import { prisma } from '@/lib/prisma';

export const POST = withAuthentication('admin', async (_req, { params: { id } }: { params: { id: string } }) => {
  let frontendUser = await prisma.frontendUser.findFirst({ where: { id } });
  if (!frontendUser) {
    return responseJson(null, { status: 404 });
  }

  const passwordResetToken = createPasswordResetToken();
  frontendUser = await prisma.frontendUser.update({
    where: { id: frontendUser.id },
    data: {
      passwordResetToken,
    },
  });

  await getDefaultMailer().sendMail({
    to: frontendUser.email,
    ...getForgotPasswordEmail({ user: frontendUser, passwordResetToken }),
  });

  return responseJson(null, { status: 200 });
});
