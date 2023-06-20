export interface RegisterOptions {
  values: {
    name: string;
    username: string;
    email: string;
    password: string;
  };
  verified?: boolean;
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

export interface GoogleAuthValues {
  id_token: string;
  access_token: string;
}

export type AuthToken = string;

export interface AuthPayload {
  user_id: number;
}

export interface AuthResult {
  accessToken: AuthToken;
  refreshToken: AuthToken;
}
