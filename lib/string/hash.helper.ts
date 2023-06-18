import bcrypt from 'bcrypt';

export async function createHash(str: string): Promise<string> {
  return await bcrypt.hash(str, 10);
}

export async function compareHash(
  plain: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(plain, hash);
}
