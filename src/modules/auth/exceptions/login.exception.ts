import { NoResultError } from '../../../../lib/db/errors/no-result.error';
import { getString } from '../../../../lib/helpers/resoure.helper';
import { Exception } from '../../../../lib/server/exception';
import { UnauthorizedError } from '../../../../lib/server/http-error/unauthorized.error';

export class LoginException extends Exception {
  constructor(error: any) {
    super();

    if (error instanceof NoResultError) {
      this.throw(
        new UnauthorizedError(getString('auth.exceptions.credential-not-found'))
      );
    } else if (error instanceof LoginException) {
      this.throw(new UnauthorizedError(error.error.message));
    } else {
      this.throw(error);
    }
  }
}
