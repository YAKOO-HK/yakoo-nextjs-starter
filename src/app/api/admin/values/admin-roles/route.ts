import { responseJson } from '@/lib/api-utils';
import { withAuthentication } from '@/lib/middleware/authentication';
import { prisma } from '@/lib/prisma';
import { AUTH_ITEM_TYPE_ROLE } from '@/types/rbac';

export const dynamic = 'force-dynamic';
export const GET = withAuthentication('admin', async () => {
  const roles = await prisma.adminAuthItem.findMany({
    where: { type: AUTH_ITEM_TYPE_ROLE },
    select: { name: true, description: true },
    orderBy: { name: 'asc' },
  });
  return responseJson(roles);
});
