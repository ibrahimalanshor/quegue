import { UnauthorizedError } from '../../../lib/server/http-error/unauthorized.error';
import { getString } from '../../../lib/helpers/resoure.helper';

export class RegisterException extends UnauthorizedError {
  constructor(error: any) {
    const message =
      error.errno === 1062 ? getString('auth.email-already-exists') : error;

    super({}, message as string);
  }
}
