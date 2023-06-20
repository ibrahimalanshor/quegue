import { NoResultError } from '../../../../lib/db/errors/no-result.error';
import { getString } from '../../../../lib/string/string-resource';
import { Exception } from '../../../../lib/server/exception';
import { BadRequestError } from '../../../../lib/server/http-error/bad-request.error';

export class ResetPasswordException extends Exception {
  constructor(error: any) {
    super();

    if (error instanceof NoResultError) {
      this.throw(
        new BadRequestError(
          getString('reset-password.exceptions.token-invalid')
        )
      );
    } else if (error instanceof ResetPasswordException) {
      this.throw(new BadRequestError(error.error.message));
    } else {
      this.throw(error);
    }
  }
}
