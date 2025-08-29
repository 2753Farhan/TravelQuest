import { ErrorRequestHandler } from "express";
import { BaseError } from "../errors/BaseError";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof BaseError) {
    res.status(err.statusCode).json({
      status: "error",
      errors: err.serializeErrors(),
    });
    return;
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    status: "error",
    errors: [{ message: "Internal Server Error" }],
  });
  return;
};
