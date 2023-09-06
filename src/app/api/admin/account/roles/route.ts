import { responseJson } from '@/lib/api-utils';
import { requireAdminUser } from '@/lib/auth';
import { withAuthentication } from '@/lib/middleware/authentication';
import { prisma } from '@/lib/prisma';

export const GET = withAuthentication('admin', async () => {
  const { id } = await requireAdminUser();
  const user = await prisma.adminUser.findUnique({ where: { id }, include: { roles: true } });
  // console.log({ netId, user });
  return responseJson({ items: user?.roles ?? [] });
});
