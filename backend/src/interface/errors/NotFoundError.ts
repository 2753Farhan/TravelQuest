import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
  statusCode = 404;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}