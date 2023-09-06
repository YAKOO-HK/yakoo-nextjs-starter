import type { Prisma } from '@prisma/client';
import { responseJson } from '@/lib/api-utils';
import { withAuthentication } from '@/lib/middleware/authentication';
import { withSearchParamsValidation } from '@/lib/middleware/zod-validation';
import { prisma } from '@/lib/prisma';
import { AdminFrontendUserSearchSchema, type AdminFrontendUserSearchParams } from '@/types/admin/frontend-users';
import type { UnwrapArray } from '@/types/helper';

async function getFrontendUsers(searchParams: Partial<AdminFrontendUserSearchParams>) {
  const where: Prisma.FrontendUserWhereInput = {};
  if (searchParams.name && searchParams.name !== '') {
    where.name = { contains: searchParams.name };
  }
  if (searchParams.email && searchParams.email !== '') {
    where.email = { contains: searchParams.email };
  }
  if (searchParams.hasOwnProperty('status') && searchParams.status !== '') {
    where.status = { equals: searchParams.status };
  }

  let orderBy: Prisma.FrontendUserOrderByWithRelationInput = { id: 'desc' };
  if (searchParams.sort) {
    orderBy = searchParams.sort?.startsWith('-')
      ? { [searchParams.sort.slice(1)]: 'desc' }
      : { [searchParams.sort]: 'asc' };
  }
  const pageSize = searchParams.pageSize ?? 20;
  const page = searchParams.page ?? 0;

  const total = await prisma.frontendUser.count({ where });
  const items = await prisma.frontendUser.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
      updatedAt: true,
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
export type AdminFrontendUserRow = UnwrapArray<Awaited<ReturnType<typeof getFrontendUsers>>['items']>;

export const GET = withAuthentication(
  'admin',
  withSearchParamsValidation(AdminFrontendUserSearchSchema, async (_req, query) => {
    const result = await getFrontendUsers(query);
    return responseJson(result);
  })
);
