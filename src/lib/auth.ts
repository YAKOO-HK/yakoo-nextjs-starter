import { cache } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminUser, FrontendUser } from '@prisma/client';
import { AuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import querystring from 'qs';
import { USER_STATUS_ACTIVE, UserLoginSchema, type UserLoginFormData } from '@/types/user';
import { verifyPassword } from './password';
import { prisma } from './prisma';
import 'server-only';

async function handleFrontendLogin(loginForm: UserLoginFormData) {
  const user = await prisma.frontendUser.findFirst({
    where: { username: loginForm.username, status: USER_STATUS_ACTIVE },
  });
  if (!user || !user.passwordHash || !verifyPassword(loginForm.password, user.passwordHash)) {
    return null;
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    type: 'frontend' as const,
  };
}

async function handleAdminLogin(loginForm: UserLoginFormData) {
  const user = await prisma.adminUser.findFirst({
    where: { username: loginForm.username, status: USER_STATUS_ACTIVE },
  });
  if (!user || !user.passwordHash || !verifyPassword(loginForm.password, user.passwordHash)) {
    return null;
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    type: 'admin' as const,
  };
}

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login/error',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        type: { label: 'Role', type: 'text' },
      },
      async authorize(credentials, _req) {
        const loginForm = UserLoginSchema.parse(credentials);
        // console.log({ type: loginForm.type });
        if (loginForm.type === 'admin') {
          return await handleAdminLogin(loginForm);
        }
        return await handleFrontendLogin(loginForm);
      },
    }),
  ],
  callbacks: {
    async signIn({ account, user }) {
      // console.log('signIn', { profile, account, user });
      if (user && account?.provider === 'credentials') {
        // Password login
        return true;
      }
      return false;
    },
    async jwt({ user, token }) {
      // console.log('jwt', { user, token });
      return {
        ...user,
        ...token,
      };
    },
    async session({ session, token }) {
      // console.log('session', params);
      if (token) {
        session.user = token;
      }
      return session;
    },
  },
};

export function getRedirectUrl() {
  const reqHeaders = headers();
  // reqHeaders.forEach((value, key) => {
  //   console.log([key, value]);
  // });
  const path = reqHeaders.get('x-invoke-path');
  if (!path) {
    return '';
  }
  try {
    const searchParams = decodeURI(reqHeaders.get('x-invoke-query') ?? '{}');
    const query = querystring.stringify(searchParams, { arrayFormat: 'repeat' });
    return query === '' ? path : `${path}?${query}`;
  } catch (e: any) {
    return path;
  }
}

export const getSessionUser = cache(async function () {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
});

export const getActiveFrontendUser = cache(async (id: FrontendUser['id']) => {
  return await prisma.frontendUser.findUnique({
    where: { id, status: USER_STATUS_ACTIVE },
    select: { id: true, username: true, email: true, name: true },
  });
});

export const requireFrontendUser = cache(async function () {
  const session = await getServerSession(authOptions);
  if (session?.user?.type !== 'frontend') {
    return redirect(`/login?callbackUrl=${getRedirectUrl()}`);
  }
  const dbUser = await getActiveFrontendUser(session.user.id);
  if (!dbUser) {
    return redirect(`/logout?callbackUrl=${getRedirectUrl()}`);
  }
  return session.user;
});

export const getActiveAdminUser = cache(async (id: AdminUser['id']) => {
  return await prisma.adminUser.findUnique({
    where: { id, status: USER_STATUS_ACTIVE },
    select: { id: true, username: true, email: true, name: true },
  });
});

export const requireAdminUser = cache(async function () {
  const session = await getServerSession(authOptions);
  if (session?.user?.type !== 'admin') {
    return redirect(`/admin/login?callbackUrl=${getRedirectUrl()}`);
  }
  const dbUser = await getActiveAdminUser(session.user.id);
  if (!dbUser) {
    return redirect(`/admin/logout?callbackUrl=${getRedirectUrl()}`);
  }
  return dbUser;
});
