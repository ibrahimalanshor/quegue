import { Request, Response, NextFunction } from 'express';
import { Exception } from './exception';

interface ErrorMiddlewareConfig {
  log: boolean;
}

export class BaseError {
  constructor(
    public status: number = 500,
    public errors: any = {},
    public message: string = ''
  ) {}
}

export function createErrorMiddleware(config?: ErrorMiddlewareConfig) {
  return (
    err: BaseError | Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response => {
    if (err instanceof Exception && err.error instanceof BaseError) {
      return res.status(err.error.status).json({
        status: err.error.status,
        message: err.error.message,
        errors: err.error.errors,
      });
    }

    if (err instanceof BaseError) {
      return res.status(err.status).json({
        status: err.status,
        message: err.message,
        errors: err.errors,
      });
    }

    if (config?.log) {
      console.log(err instanceof Exception ? err.error : err);
    }

    return res.status(500).json({
      status: 500,
      errors: err instanceof Exception ? err.error : err,
    });
  };
}
