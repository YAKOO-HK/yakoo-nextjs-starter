import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultSession['user'] {
    type: 'frontend' | 'admin';
  }

  interface Session extends DefaultSession {}
}
