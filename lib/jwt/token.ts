import jwt, { SignOptions } from 'jsonwebtoken';

export async function generateToken(
  payload: any,
  secret: string,
  options?: SignOptions
) {
  return await jwt.sign(payload, secret, options);
}

export async function verifyToken<T>(
  token: string,
  secret: string
): Promise<T> {
  return (await jwt.verify(token, secret)) as T;
}
