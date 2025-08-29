import { BaseError } from './BaseError';
export class ConflictError extends BaseError {
  statusCode = 409;

  constructor(public message: string) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}