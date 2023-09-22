import { getForgotPasswordEmail } from '@/emails/admin/forgot-password';
import { getDefaultMailer } from '@/emails/mailer';
import { responseJson } from '@/lib/api-utils';
import { withAdminRole } from '@/lib/middleware/authentication';
import { createPasswordResetToken } from '@/lib/password';
import { prisma } from '@/lib/prisma';

export const POST = withAdminRole('sysadmin', async (_req, { params: { id } }: { params: { id: string } }) => {
  let admin = await prisma.adminUser.findUnique({ where: { id } });
  if (!admin) {
    return responseJson(null, { status: 404 });
  }
  const passwordResetToken = createPasswordResetToken();
  admin = await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordResetToken },
  });

  await getDefaultMailer().sendMail({
    to: admin.email,
    ...getForgotPasswordEmail({ user: admin, passwordResetToken }),
  });

  return responseJson(null, { status: 200 });
});
