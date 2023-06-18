import { GoogleUserInfoError } from '../../../../lib/google/google.exception';
import { getString } from '../../../../lib/helpers/resoure.helper';
import { Exception } from '../../../../lib/server/exception';
import { BadRequestError } from '../../../../lib/server/http-error/bad-request.error';

export class GoogleAuthException extends Exception {
  constructor(error: any) {
    super();

    if (error instanceof GoogleUserInfoError) {
      this.throw(
        new BadRequestError(getString('auth.exceptions.google-auth-error'))
      );
    } else if (error instanceof GoogleAuthException) {
      this.throw(new BadRequestError(error.error.message));
    } else {
      this.throw(error);
    }
  }
}
