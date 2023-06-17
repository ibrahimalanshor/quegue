import jwt, { SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../../src/config/jwt.config';

export async function generateToken(
  payload: any,
  secret: string,
  options?: SignOptions
) {
  return await jwt.sign(payload, secret, options);
}
