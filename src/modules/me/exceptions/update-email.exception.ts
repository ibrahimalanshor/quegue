import { ConflictError } from '../../../../lib/db/errors/conflict.error';
import { getString } from '../../../../lib/helpers/resoure.helper';
import { Exception } from '../../../../lib/server/exception';
import { BadRequestError } from '../../../../lib/server/http-error/bad-request.error';

export class UpdateEmailException extends Exception {
  constructor(error: any) {
    super();

    if (error instanceof ConflictError) {
      this.throw(
        new BadRequestError(getString('me.exceptions.email-already-exists'))
      );
    } else if (error instanceof UpdateEmailException) {
      this.throw(new BadRequestError(error.error.message));
    } else {
      this.throw(error);
    }
  }
}
