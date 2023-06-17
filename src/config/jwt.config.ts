export const jwtConfig = {
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'secret',
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'secret',
};
