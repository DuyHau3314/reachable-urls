import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { HttpStatusCode } from "../constant/HttpStatusCodes";

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: HttpStatusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  logger.error(
    `${err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR} - ${
      err.message
    } - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  return res
    .status(err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR)
    .json({
      status: "error",
      statusCode: err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: err.message || "Internal Server Error",
    });
};
