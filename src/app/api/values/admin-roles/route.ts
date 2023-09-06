import { responseJson } from '@/lib/api-utils';
import { prisma } from '@/lib/prisma';

export const dynamic  = 'force-dynamic';
export async function GET() {
  const roles = await prisma.adminRole.findMany({
    select: {
      name: true,
      description: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
  return responseJson(roles);
}
