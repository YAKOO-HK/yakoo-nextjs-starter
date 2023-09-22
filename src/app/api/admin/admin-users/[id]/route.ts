import { responseJson } from '@/lib/api-utils';
import { withAdminRole } from '@/lib/middleware/authentication';
import { withBodyValidation } from '@/lib/middleware/zod-validation';
import { prisma } from '@/lib/prisma';
import { AdminUserPatchSchema, AdminUserPutSchema } from '@/types/admin/admin-users';

async function getAdminUserWithRoles(id: string) {
  return await prisma.adminUser.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      authAssignments: {
        select: {
          authItem: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}
export type AdminUserWithRoles = NonNullable<Awaited<ReturnType<typeof getAdminUserWithRoles>>>;

export const GET = withAdminRole('sysadmin', async (_req, { params: { id } }: { params: { id: string } }) => {
  const adminUser = await getAdminUserWithRoles(id);
  if (!adminUser) {
    return responseJson(null, { status: 404 });
  }
  return responseJson(adminUser, { status: 200 });
});

export const PATCH = withAdminRole(
  'sysadmin',
  withBodyValidation(AdminUserPatchSchema, async (_req, body, { params: { id } }: { params: { id: string } }) => {
    let adminUser = await prisma.adminUser.findUnique({ where: { id }, select: { id: true } });
    if (!adminUser) {
      return responseJson(null, { status: 404 });
    }
    return responseJson(
      await prisma.adminUser.update({ where: { id }, data: body, select: { id: true, updatedAt: true } })
    );
  })
);

export const PUT = withAdminRole(
  'sysadmin',
  withBodyValidation(
    AdminUserPutSchema,
    async (_req, { roleNames, ...body }, { params: { id } }: { params: { id: string } }) => {
      const adminUser = await prisma.adminUser.findUnique({ where: { id } });
      if (!adminUser) {
        return responseJson(null, { status: 404 });
      }
      // console.log({ roleNames });

      const updatedUser = await prisma.$transaction(async (tx) => {
        await tx.adminAuthAssignment.deleteMany({ where: { userId: adminUser.id, itemName: { notIn: roleNames } } });
        return await tx.adminUser.update({
          where: { id },
          data: {
            ...body,
            authAssignments: {
              connectOrCreate: roleNames.map((name) => ({
                where: { userId_itemName: { userId: adminUser.id, itemName: name } },
                create: { itemName: name },
              })),
            },
          },
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            authAssignments: {
              select: {
                authItem: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        });
      });
      return responseJson(updatedUser, { status: 200 });
    }
  )
);

export const DELETE = withAdminRole('sysadmin', async (_req, { params: { id } }: { params: { id: string } }) => {
  const adminUser = await prisma.adminUser.findUnique({ where: { id } });
  if (!adminUser) {
    return responseJson(null, { status: 404 });
  }
  await prisma.adminUser.delete({ where: { id } });
  return responseJson(null, { status: 200 });
});
