import { format, parse, startOfDay } from 'date-fns';
import { responseJson } from '@/lib/api-utils';
import { withAuthentication } from '@/lib/middleware/authentication';
import { withBodyValidation } from '@/lib/middleware/zod-validation';
import { prisma } from '@/lib/prisma';
import { AdminFrontendUserPatchSchema, AdminFrontendUserPutSchema } from '@/types/admin/frontend-users';

async function getFrontendUser(id: string) {
  const frontendUser = await prisma.frontendUser.findUnique({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      dob: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    where: { id },
  });
  return frontendUser && { ...frontendUser, dob: frontendUser.dob && format(frontendUser.dob, 'yyyy-MM-dd') };
}

export type AdminFrontendUserGetResponse = NonNullable<Awaited<ReturnType<typeof getFrontendUser>>>;

export const GET = withAuthentication('admin', async (_req, { params: { id } }: { params: { id: string } }) => {
  const frontendUser = await getFrontendUser(id);
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

export const PUT = withAuthentication(
  'admin',
  withBodyValidation(
    AdminFrontendUserPutSchema,
    async (req, { dob, ...body }, { params: { id } }: { params: { id: string } }) => {
      const frontendUser = await prisma.frontendUser.findUnique({ where: { id } });
      if (!frontendUser) {
        return responseJson(null, { status: 404 });
      }
      await prisma.frontendUser.update({
        where: { id },
        data: {
          ...body,
          dob: dob ? parse(dob, 'yyyy-MM-dd', startOfDay(new Date())) : null,
        },
      });
      return responseJson(await getFrontendUser(id), { status: 200 });
    }
  )
);
