import 'reflect-metadata';

import { createServer } from './lib/server/server';
import { serverConfig } from './src/config/server.config';
import { routes } from './src/modules/routes';

export const server = createServer({
  port: serverConfig.port,
  routes,
});
