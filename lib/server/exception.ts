import { BaseError } from './error';

export class Exception {
  error: BaseError;

  throw(error: BaseError) {
    this.error = error;
  }
}
