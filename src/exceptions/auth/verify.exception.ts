import { UnauthorizedError } from '../../../lib/server/http-error/unauthorized.error';
import { getString } from '../../../lib/helpers/resoure.helper';
import { NoResultError } from '../../../lib/db/errors/no-result.error';

export class VerifyException extends UnauthorizedError {
  constructor(error: any) {
    const message =
      error instanceof NoResultError
        ? getString('auth.token-invalid')
        : error.message;

    super({}, message as string);
  }
}
