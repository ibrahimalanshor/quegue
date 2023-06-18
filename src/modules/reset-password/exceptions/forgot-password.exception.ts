import { NoResultError } from '../../../../lib/db/errors/no-result.error';
import { getString } from '../../../../lib/string/string-resource';
import { BadRequestError } from '../../../../lib/server/http-error/bad-request.error';
import { Exception } from '../../../../lib/server/exception';

export class ForgotPasswordException extends Exception {
  constructor(error: any) {
    super();

    if (error instanceof NoResultError) {
      this.throw(
        new BadRequestError(
          getString('reset-password.exceptions.email-not-found')
        )
      );
    } else {
      this.throw(error);
    }
  }
}
