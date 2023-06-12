import bcrypt from 'bcrypt';

export async function hash(str: string): Promise<string> {
  return await bcrypt.hash(str, 10);
}

export async function compare(plain: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(plain, hash);
}
