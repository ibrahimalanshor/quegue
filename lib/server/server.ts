import express from 'express';

interface ServerConfig {
  port: number;
}

class Server {
  express: express.Application;
  config: ServerConfig = {
    port: 3000,
  };

  constructor(express: express.Application, config?: Partial<ServerConfig>) {
    this.express = express;

    if (config) {
      this.config.port = config.port || 3000;
    }
  }

  listen(cb?: (port: number) => void) {
    const port = this.config.port || 3000;

    this.express.listen(port, () => {
      cb ? cb(port) : console.log(`server running at ${port}`);
    });
  }
}

export function createServer(config?: Partial<ServerConfig>): Server {
  return new Server(express(), config);
}
