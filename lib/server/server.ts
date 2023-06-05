import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { createErrorMiddleware } from './error';

interface ServerConfig {
  port: number;
  routes: express.Router[];
  errorLog: boolean;
}

class Server {
  app: express.Application;
  config: ServerConfig = {
    port: 3000,
    routes: [],
    errorLog: true,
  };

  constructor(app: express.Application, config?: Partial<ServerConfig>) {
    this.app = app;

    if (config) {
      this.config.port = config.port || 3000;
      this.config.routes = config.routes || [];
      this.config.errorLog = config.errorLog || true;
    }

    this.setRoutes();
    this.setErrorMiddleware();
  }

  setRoutes() {
    this.config.routes.forEach((route) => this.app.use(route));
  }

  setErrorMiddleware() {
    this.app.use(createErrorMiddleware({ log: this.config.errorLog }));
  }

  listen(cb?: (port: number) => void) {
    const port = this.config.port || 3000;

    this.app.listen(port, () => {
      cb ? cb(port) : console.log(`server running at ${port}`);
    });
  }
}

export function createServer(config?: Partial<ServerConfig>): Server {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(morgan('tiny'));

  return new Server(app, config);
}
