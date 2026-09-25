import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export class AppError extends Error {
  public statusCode: number;
  public errors?: Record<string, unknown>;

  constructor(message: string, statusCode: number = 400, errors?: Record<string, unknown>) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal server error";
  let errors: any = undefined;

  // Custom Application Errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }
  // Zod Validation Errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = err.flatten().fieldErrors;
  }
  // Prisma Known Request Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        statusCode = 409;
        const target = Array.isArray(err.meta?.target)
          ? err.meta.target.join(", ")
          : (err.meta?.target as string) || "field";
        message = `A record with this ${target} already exists`;
        break;
      }
      case "P2025": {
        statusCode = 404;
        message = (err.meta?.cause as string) || "Requested record not found";
        break;
      }
      case "P2003": {
        statusCode = 400;
        message = "Foreign key constraint failed: related record not found";
        break;
      }
      default: {
        statusCode = 400;
        message = err.message;
        break;
      }
    }
  }
  // Prisma Validation Errors
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Database query validation failed";
  }
  // Prisma Connection / Initialization Errors
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 503;
    message = "Database connection error";
  }
  // JWT Errors
  else if (err instanceof TokenExpiredError) {
    statusCode = 401;
    message = "Token has expired";
  } else if (err instanceof JsonWebTokenError) {
    statusCode = 401;
    message = "Invalid or malformed token";
  }
  // Generic / System Errors
  else if (err instanceof Error) {
    statusCode = (err as any).statusCode || (err as any).status || 500;
    message =
      process.env.NODE_ENV === "production" && statusCode === 500
        ? "Internal server error"
        : err.message || "Internal server error";
  }

  // Consistent response format
  const responsePayload: Record<string, unknown> = {
    message,
    ...(errors !== undefined && { errors }),
    ...(process.env.NODE_ENV !== "production" && err?.stack && { stack: err.stack }),
  };

  res.status(statusCode).json(responsePayload);
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};
