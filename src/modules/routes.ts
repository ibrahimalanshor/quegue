import { authRoute } from './auth/auth.route';
import { meRoute } from './me/me.route';
import { resetPasswordRoute } from './reset-password/reset-password.route';
import { userResource } from './user/user.resource';
import { verificationRoute } from './verification/verification.route';

export const routes = [
  authRoute,
  verificationRoute,
  resetPasswordRoute,
  meRoute,
  userResource.router,
];
