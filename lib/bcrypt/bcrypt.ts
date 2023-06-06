import bcrypt from 'bcrypt';

export async function hash(str: string): Promise<string> {
  return await bcrypt.hash(str, 10);
}
