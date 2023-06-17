import Container from 'typedi';
import { createRoute } from '../../../lib/server/router';
import { VerificationController } from './verification.controller';
import {
  createJsonResponse,
  createResponse,
} from '../../../lib/server/response';
import { createBodyValidator } from '../../../lib/server/middlewares/request.middleware';
import { ResendVerificationDto } from './dto/resend-verification.dto';

export const verificationRoute = createRoute(
  Container.get(VerificationController)
)
  .get(
    '/api/verification/verify/:token',
    (controller: VerificationController) => createResponse(controller.verify)
  )
  .post(
    '/api/verification/resend-verification',
    (controller: VerificationController) => [
      createBodyValidator(ResendVerificationDto),
      createJsonResponse(controller.resendVerification),
    ]
  )
  .getRouter();
