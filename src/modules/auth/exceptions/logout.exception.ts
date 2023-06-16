import { NoAffectedError } from '../../../../lib/db/errors/no-affected.error';
import { getString } from '../../../../lib/helpers/resoure.helper';
import { BadRequestError } from '../../../../lib/server/http-error/bad-request.error';

export class LogoutException extends BadRequestError {
  constructor(error: any) {
    const message =
      error instanceof NoAffectedError
        ? getString('auth.exceptions.token-invalid')
        : error.message;

    super({}, message as string);
  }
}
