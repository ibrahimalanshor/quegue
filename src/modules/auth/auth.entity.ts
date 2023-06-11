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
}

export interface LogoutValues {
  token: string;
}

export interface VerifyUserValues {
  token: string;
}

export type AuthToken = string;

export interface AuthResult {
  accessToken: AuthToken;
  refreshToken: AuthToken;
}
