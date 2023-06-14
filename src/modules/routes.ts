import { authRoute } from './auth/auth.route';
import { resetPasswordRoute } from './reset-password/reset-password.route';
import { verificationRoute } from './verification/verification.route';

export const routes = [authRoute, verificationRoute, resetPasswordRoute];
