import { responseJson } from '@/lib/api-utils';
import { withAuthentication } from '@/lib/middleware/authentication';
import { withBodyValidation } from '@/lib/middleware/zod-validation';
import { prisma } from '@/lib/prisma';
import { AdminFrontendUserPatchSchema } from '@/types/admin/frontend-users';

export const GET = withAuthentication('admin', async (_req, { params: { id } }: { params: { id: string } }) => {
  const frontendUser = await prisma.frontendUser.findUnique({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    where: { id },
  });
  if (!frontendUser) {
    return responseJson(null, { status: 404 });
  }
  return responseJson(frontendUser);
});

export const PATCH = withAuthentication(
  'admin',
  withBodyValidation(
    AdminFrontendUserPatchSchema,
    async (req, body, { params: { id } }: { params: { id: string } }) => {
      const frontendUser = await prisma.frontendUser.findUnique({ where: { id } });
      if (!frontendUser) {
        return responseJson(null, { status: 404 });
      }
      await prisma.frontendUser.update({ where: { id }, data: body });
      return responseJson(null, { status: 200 });
    }
  )
);
