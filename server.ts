import { createServer } from './lib/server/server';
import { serverConfig } from './src/config/server.config';

export const server = createServer({
  port: serverConfig.port,
});
