import { UnauthorizedError } from '../../../lib/server/http-error/unauthorized.error';
import { getString } from '../../../lib/helpers/resoure.helper';
import { ConflictError } from '../../../lib/db/errors/conflict.error';

export class RegisterException extends UnauthorizedError {
  constructor(error: any) {
    const message =
      error instanceof ConflictError
        ? getString('auth.email-already-exists')
        : error.message;

    super({}, message as string);
  }
}
