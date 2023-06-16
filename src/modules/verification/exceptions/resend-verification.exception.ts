import { NoResultError } from '../../../../lib/db/errors/no-result.error';
import { getString } from '../../../../lib/helpers/resoure.helper';
import { BadRequestError } from '../../../../lib/server/http-error/bad-request.error';

export class ResendVerificationException extends BadRequestError {
  constructor(error: any) {
    const message =
      error instanceof NoResultError
        ? getString('verification.exceptions.email-not-found')
        : error.message;

    super({}, message as string);
  }
}
