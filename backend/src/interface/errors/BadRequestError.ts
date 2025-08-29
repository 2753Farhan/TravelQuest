import { BaseError } from './BaseError';

export class BadRequestError extends BaseError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
