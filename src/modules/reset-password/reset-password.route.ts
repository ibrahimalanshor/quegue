import Container from 'typedi';
import { createRoute } from '../../../lib/server/router';
import { ResetPasswordController } from './reset-password.controller';
import { createBodyValidator } from '../../../lib/server/middlewares/request.middleware';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { createJsonResponse } from '../../../lib/server/response';

export const resetPasswordRoute = createRoute(
  Container.get(ResetPasswordController)
)
  .post('/api/forgot-password', (controller) => [
    createBodyValidator(ForgotPasswordDto),
    createJsonResponse(controller.forgotPassword),
  ])
  .getRouter();
