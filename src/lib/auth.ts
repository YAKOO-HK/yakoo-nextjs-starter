import { cache } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminUser, FrontendUser } from '@prisma/client';
import { createVerifier } from 'fast-jwt';
import NextAuth, { CredentialsSignin } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Secret, TOTP } from 'otpauth';
import { z } from 'zod';
import { env } from '@/env';
import { TotpConfigSchema } from '@/types/totp';
import { USER_STATUS_ACTIVE, UserLoginSchema, type UserLoginFormData } from '@/types/user';
import { verifyPassword } from './password';
import { prisma } from './prisma';
import 'server-only';

class LoginError extends CredentialsSignin {
  code: 'invalid-credentials' | 'otp-required' | 'invalid-otp';
  constructor(code: 'invalid-credentials' | 'otp-required' | 'invalid-otp') {
    super({ code });
    this.code = code;
  }
}

async function handleFrontendLogin(loginForm: UserLoginFormData) {
  const user = await prisma.frontendUser.findFirst({
    where: { username: loginForm.username, status: USER_STATUS_ACTIVE },
    include: { totp: true },
  });
  if (!user || !user.passwordHash || !verifyPassword(loginForm.password, user.passwordHash)) {
    // console.log(loginForm, user);
    throw new LoginError('invalid-credentials');
  }
  if (user.enableMfa && user.totp?.secret) {
    if (!loginForm.totp) {
      throw new LoginError('otp-required');
    }
    const config = TotpConfigSchema.parse(user.totp.config ?? {});
    const totp = new TOTP({
      secret: Secret.fromHex(user.totp.secret),
      ...config,
    });
    if (totp.validate({ token: loginForm.totp, window: 1 }) == null) {
      throw new LoginError('invalid-otp');
    }
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
    throw new LoginError('invalid-credentials');
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    type: 'admin' as const,
  };
}

const TokenSchema = z.object({
  token: z.string(),
});
const authOptions: Parameters<typeof NextAuth>[0] = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        totp: { label: 'Time-Based One-Time Password', type: 'text' },
        type: { label: 'Role', type: 'text' },
      },
      async authorize(credentials, _req) {
        const loginForm = UserLoginSchema.safeParse(credentials);
        if (!loginForm.success) {
          throw new LoginError('invalid-credentials');
        }
        // console.log({ type: loginForm.type });
        if (loginForm.data.type === 'admin') {
          return await handleAdminLogin(loginForm.data);
        }
        return await handleFrontendLogin(loginForm.data);
      },
    }),
    CredentialsProvider({
      id: 'samlify',
      name: 'SAML2',
      credentials: {
        token: { label: 'JWT TOken', type: 'text' },
      },
      async authorize(credentials, _req) {
        if (!env.SAML_ENABLED) {
          throw new LoginError('invalid-credentials');
        }

        // console.log('samlify.authorize', credentials);
        const result = TokenSchema.safeParse(credentials);
        if (!result.success) {
          throw new LoginError('invalid-credentials');
        }

        const verifySync = createVerifier({ key: env.AUTH_SECRET });
        const payload = verifySync(result.data.token ?? '');
        // console.log(payload);
        const user = await prisma.frontendUser.findFirst({
          where: { email: payload.email, status: USER_STATUS_ACTIVE },
        });
        if (!user) {
          throw new LoginError('invalid-credentials');
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          type: 'frontend' as const,
        };
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
      if (user && account?.provider === 'samlify') {
        // SAML login
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
      // console.log('session', session);
      // console.log('token', token);
      if (token) {
        session.user = {
          id: token.id ?? '',
          email: token.email ?? '',
          type: token.type ?? 'frontend',
          name: token.name ?? null,
          image: null,
          emailVerified: null,
        };
      }
      return session;
    },
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);

export async function getRedirectUrl() {
  const reqHeaders = await headers();
  // reqHeaders.forEach((value, key) => {
  //   console.log([key, value]);
  // });
  const url = reqHeaders.get('x-url');
  if (!url) {
    return '';
  }
  try {
    const invokeUrl = new URL(url);
    const query = invokeUrl.searchParams.toString();
    return invokeUrl.pathname + (query ? `?${query}` : '');
  } catch (e: any) {
    return '';
  }
}

export const getSessionUser = cache(async function () {
  const session = await auth();
  return session?.user ?? null;
});

export const getActiveFrontendUser = cache(async (id?: FrontendUser['id']) => {
  if (!id) return null;
  return await prisma.frontendUser.findUnique({
    where: { id, status: USER_STATUS_ACTIVE },
    select: { id: true, username: true, email: true, name: true, enableMfa: true, status: true },
  });
});

export const requireFrontendUser = cache(async function () {
  const session = await auth();
  if (session?.user?.type !== 'frontend') {
    return redirect(`/login?callbackUrl=${await getRedirectUrl()}`);
  }
  const dbUser = await getActiveFrontendUser(session.user.id);
  if (!dbUser) {
    return redirect(`/logout?callbackUrl=${await getRedirectUrl()}`);
  }
  return dbUser;
});

export const getActiveAdminUser = cache(async (id?: AdminUser['id']) => {
  if (!id) return null;
  return await prisma.adminUser.findUnique({
    where: { id, status: USER_STATUS_ACTIVE },
    select: { id: true, username: true, email: true, name: true },
  });
});

export const requireAdminUser = cache(async function () {
  const session = await auth();
  if (session?.user?.type !== 'admin') {
    return redirect(`/admin/login?callbackUrl=${await getRedirectUrl()}`);
  }
  const dbUser = await getActiveAdminUser(session.user.id);
  if (!dbUser) {
    return redirect(`/admin/logout?callbackUrl=${await getRedirectUrl()}`);
  }
  return dbUser;
});
