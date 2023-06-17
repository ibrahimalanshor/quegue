import { RequestHandler, Request, Response, NextFunction } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { NoResultError } from '../../../../lib/db/errors/no-result.error';
import { getString } from '../../../../lib/helpers/resoure.helper';
import { verifyToken } from '../../../../lib/jwt/token';
import { UnauthorizedError } from '../../../../lib/server/http-error/unauthorized.error';
import { jwtConfig } from '../../../config/jwt.config';
import { userResource } from '../../user/user.resource';
import { AuthPayload } from '../auth.entity';

export function createAuthMiddleware(): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new UnauthorizedError(
          getString('auth.exceptions.access-token-required')
        );
      }

      const accessTokenPayload = await verifyToken<AuthPayload>(
        accessToken,
        jwtConfig.accessTokenSecret
      );

      const user = await userResource.service.findOne({
        filter: {
          id: {
            operator: '=',
            value: accessTokenPayload.user_id,
          },
        },
        columns: [
          'id',
          'name',
          'username',
          'email',
          'verified_at',
          'created_at',
          'updated_at',
        ],
        throwOnNoResult: true,
      });

      req.user = user;

      return next();
    } catch (err) {
      if (err instanceof JsonWebTokenError || err instanceof NoResultError) {
        return next(
          new UnauthorizedError(
            getString('auth.exceptions.access-token-invalid')
          )
        );
      }

      return next(err);
    }
  };
}
