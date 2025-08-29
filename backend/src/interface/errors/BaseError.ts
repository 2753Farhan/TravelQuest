export abstract class BaseError extends Error {
    abstract statusCode: number;

    constructor(message: string){
        super(message);
        Object.setPrototypeOf(this,new.target.prototype);
        Error.captureStackTrace(this), this.constructor;
    }

    abstract serializeErrors(): { message: string; field?: string }[];
}