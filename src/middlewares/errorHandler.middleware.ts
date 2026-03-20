import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/errors.classes.js";
import { ZodError } from "zod";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
};

export default errorHandler;
