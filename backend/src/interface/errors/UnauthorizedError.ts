import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
    statusCode = 401;
    constructor(public message = "User is unauthorized"){
        super(message);
    }
      serializeErrors() {
    return [{ message: this.message }];
        
    }

}


