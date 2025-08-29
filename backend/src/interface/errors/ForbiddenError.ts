import { BaseError } from './BaseError';

export class ForbiddenError extends BaseError {
  statusCode = 403;

  constructor(public message: string) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
