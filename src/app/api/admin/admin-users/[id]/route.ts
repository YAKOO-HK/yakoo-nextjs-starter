import { responseJson } from '@/lib/api-utils';
import { withAdminRole } from '@/lib/middleware/authentication';
import { withBodyValidation } from '@/lib/middleware/zod-validation';
import { prisma } from '@/lib/prisma';
import { AdminUserPatchSchema } from '@/types/admin/admin-users';

async function getAdminUserWithRoles(id: string) {
  const adminUser = await prisma.adminUser.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      roles: {
        select: {
          name: true,
          description: true,
        },
      },
    },
  });
  return adminUser;
}
export type AdminUserWithRoles = NonNullable<Awaited<ReturnType<typeof getAdminUserWithRoles>>>;

export const GET = withAdminRole('admin', async (_req, { params: { id } }: { params: { id: string } }) => {
  const adminUser = await getAdminUserWithRoles(id);
  if (!adminUser) {
    return responseJson(null, { status: 404 });
  }
  return responseJson(adminUser, { status: 200 });
});

export const PATCH = withAdminRole(
  'admin',
  withBodyValidation(
    AdminUserPatchSchema,
    async (_req, { roleNames, ...body }, { params: { id } }: { params: { id: string } }) => {
      const adminUser = await prisma.adminUser.findUnique({ where: { id } });
      if (!adminUser) {
        return responseJson(null, { status: 404 });
      }
      const updatedUser = await prisma.adminUser.update({
        where: { id },
        data: {
          ...body,
          roles: {
            set: roleNames?.map((name) => ({ name })),
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          roles: true,
        },
      });
      // console.log({ updatedUser, body, roleNames });
      return responseJson(updatedUser, { status: 200 });
    }
  )
);

export const DELETE = withAdminRole('admin', async (_req, { params: { id } }: { params: { id: string } }) => {
  const adminUser = await prisma.adminUser.findUnique({ where: { id } });
  if (!adminUser) {
    return responseJson(null, { status: 404 });
  }
  await prisma.adminUser.delete({ where: { id } });
  return responseJson(null, { status: 200 });
});
