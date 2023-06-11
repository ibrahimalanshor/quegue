import { getString } from '../../../lib/helpers/resoure.helper';
import { ConflictError } from '../../../lib/db/errors/conflict.error';
import { BadRequestError } from '../../../lib/server/http-error/bad-request.error';

export class RegisterException extends BadRequestError {
  constructor(error: any) {
    const message =
      error instanceof ConflictError
        ? getString('auth.email-already-exists')
        : error.message;

    super({}, message as string);
  }
}
