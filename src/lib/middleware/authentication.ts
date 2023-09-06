import { cache } from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '../prisma';
import 'server-only';

export function withAuthentication(
  role: 'admin' | 'frontend',
  handler: (req: NextRequest, ...args: any[]) => Promise<unknown> | unknown
) {
  return async function (req: NextRequest, ...args: any[]) {
    // console.log(args);
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(null, { status: 401 });
    } else if (!!role && session?.user?.type !== role) {
      return NextResponse.json(null, { status: 403 });
    }
    return handler(req, ...args);
  };
}

export const hasAdminRole = cache(async function (id: string, roleName: string) {
  const count = await prisma.adminUser.count({
    where: {
      id,
      roles: {
        some: {
          name: roleName,
        },
      },
    },
  });
  return !count;
});

export function withAdminRole(
  adminRole: string,
  handler: (req: NextRequest, ...args: any[]) => Promise<unknown> | unknown
) {
  return async function (req: NextRequest, ...args: any[]) {
    // console.log(args);
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(null, { status: 401 });
    } else if (session?.user?.type !== 'admin') {
      return NextResponse.json(null, { status: 403 });
    } else if (!hasAdminRole(session.user.id, adminRole)) {
      return NextResponse.json(null, { status: 403 });
    }
    return handler(req, ...args);
  };
}
