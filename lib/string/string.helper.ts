import crypto from 'crypto';

export function randomString(size: number = 24): string {
  return crypto.randomBytes(size).toString('hex');
}
