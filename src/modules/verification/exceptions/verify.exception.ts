import { NoResultError } from '../../../../lib/db/errors/no-result.error';
import { getString } from '../../../../lib/helpers/resoure.helper';
import { Exception } from '../../../../lib/server/exception';
import { BadRequestError } from '../../../../lib/server/http-error/bad-request.error';

export class VerifyException extends Exception {
  constructor(error: any) {
    super();

    if (error instanceof NoResultError) {
      this.throw(
        new BadRequestError(getString('verification.exceptions.token-invalid'))
      );
    } else {
      this.throw(error);
    }
  }
}
