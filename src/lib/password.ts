import { randomBytes, scryptSync } from 'node:crypto';
import { env } from '@/env';
import 'server-only';

export function createPasswordHash(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const passwordHash = scryptSync(password, salt, 64).toString('hex');
  return [passwordHash, salt].join('$');
}

export function verifyPassword(password: string, hash: string): boolean {
  if (!password || !hash) return false;
  const [hashString = '', salt = ''] = hash.split('$');
  const inputPasswordHash = scryptSync(password, salt, 64).toString('hex');
  return hashString === inputPasswordHash;
}

export function createPasswordResetToken(): string {
  const token = randomBytes(32).toString('hex');
  const expireAt = Math.trunc(new Date().getTime() / 1000); // current timestamp in seconds
  return `${token}_${expireAt}`;
}

const DAY_IN_SECONDS = 24 * 60 * 60;
export function verifyPasswordResetToken(token: string): boolean {
  const [, expireAt] = token.split('_');
  if (!expireAt) {
    return false;
  }
  const now = Math.trunc(new Date().getTime() / 1000);
  const diff = now - parseInt(expireAt, 10);
  return diff < DAY_IN_SECONDS * env.PASSWORD_RESET_TOKEN_EXPIRE_IN_DAYS;
}
