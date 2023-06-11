import Container from 'typedi';
import { createRoute } from '../../../lib/server/router';
import { AuthController } from './auth.controller';
import {
  createJsonResponse,
  createResponse,
} from '../../../lib/server/response';
import { createBodyValidator } from '../../../lib/server/middlewares/request.middleware';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';

export const authRoute = createRoute(Container.get(AuthController))
  .post('/api/auth/login', (controller: AuthController) => [
    createBodyValidator(LoginDto),
    createJsonResponse(controller.login),
  ])
  .post('/api/auth/logout', (controller: AuthController) => [
    createBodyValidator(LogoutDto),
    createJsonResponse(controller.logout),
  ])
  .post('/api/auth/register', (controller: AuthController) => [
    createBodyValidator(RegisterDto),
    createJsonResponse(controller.register),
  ])
  .post('/api/auth/refreshToken', (controller: AuthController) => [
    createBodyValidator(RefreshTokenDto),
    createJsonResponse(controller.refreshToken),
  ])
  .get('/api/auth/verify/:token', (controller: AuthController) =>
    createResponse(controller.verify)
  )
  .post('/api/auth/resend-verification', (controller: AuthController) => [
    createBodyValidator(ResendVerificationDto),
    createJsonResponse(controller.resendVerification),
  ])
  .getRouter();
