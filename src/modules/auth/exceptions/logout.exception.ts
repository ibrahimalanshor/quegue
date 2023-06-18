import { NoAffectedError } from '../../../../lib/db/errors/no-affected.error';
import { getString } from '../../../../lib/string/string-resource';
import { Exception } from '../../../../lib/server/exception';
import { BadRequestError } from '../../../../lib/server/http-error/bad-request.error';

export class LogoutException extends Exception {
  constructor(error: any) {
    super();

    if (error instanceof NoAffectedError) {
      this.throw(
        new BadRequestError(getString('auth.exceptions.token-invalid'))
      );
    } else {
      this.throw(error);
    }
  }
}
