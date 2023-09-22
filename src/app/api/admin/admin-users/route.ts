import { Prisma } from '@prisma/client';
import { ZodError, ZodIssue } from 'zod';
import { responseJson } from '@/lib/api-utils';
import { withAdminRole } from '@/lib/middleware/authentication';
import { withBodyValidation, withSearchParamsValidation } from '@/lib/middleware/zod-validation';
import { prisma } from '@/lib/prisma';
import { AdminUserCreateSchema, AdminUserSearchSchema, type AdminUserSearchParams } from '@/types/admin/admin-users';
import { UnwrapArray } from '@/types/helper';

async function getAdminUsers(searchParams: Partial<AdminUserSearchParams>) {
  const where: Prisma.AdminUserWhereInput = {};
  if (searchParams.username && searchParams.username !== '') {
    where.username = { contains: searchParams.username };
  }
  if (searchParams.name && searchParams.name !== '') {
    where.name = { contains: searchParams.name };
  }
  if (searchParams.email && searchParams.email !== '') {
    where.email = { contains: searchParams.email };
  }
  if (searchParams.hasOwnProperty('status') && searchParams.status !== '') {
    where.status = { equals: searchParams.status };
  }

  let orderBy: Prisma.AdminUserOrderByWithRelationInput = { createdAt: 'desc' };
  if (searchParams.sort) {
    orderBy = searchParams.sort?.startsWith('-')
      ? { [searchParams.sort.slice(1)]: 'desc' }
      : { [searchParams.sort]: 'asc' };
  }
  const pageSize = searchParams.pageSize ?? 20;
  const page = searchParams.page ?? 0;

  const total = await prisma.adminUser.count({ where });
  const items = await prisma.adminUser.findMany({
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
    where,
    orderBy,
    take: pageSize,
    skip: page * pageSize,
  });
  return {
    items,
    meta: {
      totalElements: total,
      page,
      pageSize,
    },
  };
}
export type AdminUserRow = UnwrapArray<Awaited<ReturnType<typeof getAdminUsers>>['items']>;

export const GET = withAdminRole(
  'sysadmin',
  withSearchParamsValidation(AdminUserSearchSchema, async (req, query) => {
    const result = await getAdminUsers(query);
    return responseJson(result);
  })
);

export const POST = withAdminRole(
  'sysadmin',
  withBodyValidation(AdminUserCreateSchema, async (_req, { roleNames, ...body }) => {
    // check username and email is unique
    const dbIssues: ZodIssue[] = [];
    if (await prisma.adminUser.findUnique({ where: { username: body.username } })) {
      dbIssues.push({ code: 'custom', path: ['username'], message: 'Username already exists.' });
    }
    if (await prisma.adminUser.findUnique({ where: { email: body.email } })) {
      dbIssues.push({ code: 'custom', path: ['email'], message: 'Email already exists.' });
    }
    if (dbIssues.length > 0) {
      throw new ZodError(dbIssues);
    }

    const user = await prisma.adminUser.create({
      data: {
        ...body,
        passwordHash: '',
        authAssignments: {
          create: (roleNames ?? []).map((name) => ({ authItem: { connect: { name } } })),
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
      },
    });
    return responseJson(user);
  })
);
