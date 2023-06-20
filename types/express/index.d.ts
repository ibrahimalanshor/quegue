import { Express } from 'express-serve-static-core';
import { User } from '../../src/entities/user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}
