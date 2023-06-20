import { ConflictError } from '../../../../lib/db/errors/conflict.error';
import { getString } from '../../../../lib/string/string-resource';
import { Exception } from '../../../../lib/server/exception';
import { BadRequestError } from '../../../../lib/server/http-error/bad-request.error';

export class RegisterException extends Exception {
  constructor(error: any) {
    super();

    if (error instanceof ConflictError) {
      this.throw(
        new BadRequestError(getString('auth.exceptions.email-already-exists'))
      );
    } else {
      this.throw(error);
    }
  }
}
