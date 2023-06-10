import Container from 'typedi';
import { createRoute } from '../../../lib/server/router';
import { AuthController } from './auth.controller';
import { createJsonResponse } from '../../../lib/server/response';
import { createBodyValidator } from '../../../lib/server/middlewares/request.middleware';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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
  .getRouter();
