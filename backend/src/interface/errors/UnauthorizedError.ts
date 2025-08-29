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





// import { BaseError } from './BaseError';

// export class BadRequestError extends BaseError {
//   statusCode = 400;

//   constructor(public message: string) {
//     super(message);
//   }

//   serializeErrors() {
//     return [{ message: this.message }];
//   }
// }
