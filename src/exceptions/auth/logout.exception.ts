import { getString } from '../../../lib/helpers/resoure.helper';
import { BadRequestError } from '../../../lib/server/http-error/bad-request.error';
import { NoAffectedError } from '../../../lib/db/errors/no-affected.error';

export class LogoutException extends BadRequestError {
  constructor(error: any) {
    const message =
      error instanceof NoAffectedError
        ? getString('auth.token-invalid')
        : error.message;

    super({}, message as string);
  }
}