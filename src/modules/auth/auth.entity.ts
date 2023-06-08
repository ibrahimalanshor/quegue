import { StoredUser } from '../user/user.entity';

export interface RegisterValues {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface RefreshTokenValues {
  token: string;
  user: StoredUser;
}

export type AuthToken = string;

export interface AuthResult {
  accessToken: AuthToken;
  refreshToken: AuthToken;
}
