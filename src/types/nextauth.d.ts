import type { DefaultSession, DefaultUser } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User extends DefaultUser {
    type: 'frontend' | 'admin';
  }

  interface Session extends DefaultSession {
    user?: DefaultSession['user'] & { id: string; type: 'frontend' | 'admin' };
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends Record<string, unknown>, DefaultUser, DefaultJWT {
    id: string;
    type: 'frontend' | 'admin';
  }
}
