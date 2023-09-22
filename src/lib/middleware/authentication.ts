import { NextRequest, NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions, getActiveAdminUser, getActiveFrontendUser } from '@/lib/auth';
import { getAdminUserPermissions } from '@/lib/rbac';
import 'server-only';

export function withAuthentication(
  role: 'admin' | 'frontend',
  handler: (req: NextRequest, ...args: any[]) => Promise<Response> | Response,
  customRule?: (user: NonNullable<Session['user']>) => Promise<boolean> | boolean
) {
  return async function (req: NextRequest, ...args: any[]) {
    // console.log(args);
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(null, { status: 401 });
    } else if (!!role && session.user.type !== role) {
      return NextResponse.json(null, { status: 403 });
    }
    if (session.user.type === 'admin') {
      const dbUser = await getActiveAdminUser(session.user.id);
      if (!dbUser) {
        return NextResponse.json(null, { status: 401 });
      }
    } else if (session.user.type === 'frontend') {
      const dbUser = await getActiveFrontendUser(session.user.id);
      if (!dbUser) {
        return NextResponse.json(null, { status: 401 });
      }
    }

    if (customRule && !(await customRule(session.user))) {
      return NextResponse.json(null, { status: 401 });
    }
    return handler(req, ...args);
  };
}

export function withAdminRole(
  role: string,
  handler: (req: NextRequest, ...args: any[]) => Promise<Response> | Response
) {
  return withAuthentication('admin', handler, async (user) => {
    const roleAndPermissions = await getAdminUserPermissions(user.id);
    if (!roleAndPermissions.roles.has(role)) {
      return false;
    }
    return true;
  });
}
