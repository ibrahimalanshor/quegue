import Container from 'typedi';
import { createRoute } from '../../../lib/server/router';
import { createJsonResponse } from '../../../lib/server/response';
import { MeController } from './me.controller';
import { createAuthMiddleware } from '../auth/middlewares/auth.middleware';
import { createBodyValidator } from '../../../lib/server/middlewares/request.middleware';
import { UpdateMeDto } from './dto/update-me.dto';

export const meRoute = createRoute(Container.get(MeController))
  .get('/api/me', (controller) => [
    createAuthMiddleware(),
    createJsonResponse(controller.me),
  ])
  .patch('/api/me', (controller) => [
    createAuthMiddleware(),
    createBodyValidator(UpdateMeDto),
    createJsonResponse(controller.updateMe),
  ])
  .getRouter();
