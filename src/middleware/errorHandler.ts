// middlewares/errorHandler.ts
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    // Custom ApiError
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
    });
  }

  console.error(err); // for debugging

  // Generic server error
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
