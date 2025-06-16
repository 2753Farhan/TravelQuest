import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError{
    statusCode = 404;

    constructor(public message = "Resource not found") {
        super(message);
    }
    serializeErrors() {
    return [{ message: this.message }];
  }
}