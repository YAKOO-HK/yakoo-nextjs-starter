import { responseJson } from '@/lib/api-utils';
import { requireAdminUser } from '@/lib/auth';
import { withAuthentication } from '@/lib/middleware/authentication';
import { getAdminUserPermissions } from '@/lib/rbac';

export const GET = withAuthentication('admin', async (_req) => {
  const user = await requireAdminUser();
  return responseJson(await getAdminUserPermissions(user.id));
});
