import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({ message: "Invalid input data" });
  }
  return res
    .status(500)
    .json({ message: err.message || "Internal Server Error" });
};
