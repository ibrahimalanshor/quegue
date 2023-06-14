import { NoResultError } from '../../../../lib/db/errors/no-result.error';
import { getString } from '../../../../lib/helpers/resoure.helper';
import { UnauthorizedError } from '../../../../lib/server/http-error/unauthorized.error';

export class LoginException extends UnauthorizedError {
  constructor(error: any) {
    const message =
      error instanceof NoResultError
        ? getString('auth.credential-not-found')
        : error.message;

    super({}, message as string);
  }
}
