import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { ZodError } from 'zod';


const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let message = err?.message || "Something went wrong";
  const statusCode = err?.statusCode || status.INTERNAL_SERVER_ERROR;
  if (err instanceof ZodError) {
    message = err.issues[0].message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    err: err,
    stack: process.env.NODE_ENV === "development" ? err?.stack : undefined,
  });
};

export default globalErrorHandler;