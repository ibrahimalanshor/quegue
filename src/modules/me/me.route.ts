import Container from 'typedi';
import { createRoute } from '../../../lib/server/router';
import { createJsonResponse } from '../../../lib/server/response';
import { MeController } from './me.controller';
import { createAuthMiddleware } from '../auth/middlewares/auth.middleware';

export const meRoute = createRoute(Container.get(MeController))
  .get('/api/me', (controller) => [
    createAuthMiddleware(),
    createJsonResponse(controller.me),
  ])
  .getRouter();
