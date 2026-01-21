import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import handleZodError from "../../errors/handleZodError";
import parsePrismaValidationError from "../../errors/parsePrismaValidationError";
import ApiError from "../../errors/ApiErrors";

const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
};

const GlobalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: any = httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong!";
  let errorDetails: any = null;

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = "Validation error occurred.";

    // Format according to requirements
    const firstError = simplifiedError?.errorSources[0];
    if (firstError) {
      errorDetails = {
        field: firstError.path,
        message: firstError.message,
      };
    }
  }
  // Handle Custom ApiError
  else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;

    // Format based on status code
    if (
      statusCode === httpStatus.UNAUTHORIZED ||
      statusCode === httpStatus.FORBIDDEN
    ) {
      errorDetails = message;
    }
  }
  // Handle Prisma Client Validation Errors
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation error occurred.";
    errorDetails = parsePrismaValidationError(err.message);
  }
  // Prisma Known Request Error (e.g., unique constraint)
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = httpStatus.BAD_REQUEST;

    if (err.code === "P2002") {
      message = "Unique constraint violation.";
      errorDetails = `${(err.meta?.target as string[])?.join(", ")} already exists`;
    } else if (err.code === "P2025") {
      message = "Record not found.";
      errorDetails = err.meta?.cause || "The requested record does not exist";
    }
  }
  // Prisma Client Initialization Error
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Database connection error.";
    errorDetails = "Failed to connect to database";
  }
  // Prisma Client Rust Panic Error
  else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Critical database error.";
    errorDetails = "A critical error occurred in the database engine";
  }
  // Prisma Client Unknown Request Error
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Unknown database error.";
    errorDetails = "An unknown error occurred while processing the request";
  }
  // Generic Error Handling
  else if (err instanceof SyntaxError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Syntax error in request.";
    errorDetails = "Please verify your input syntax";
  } else if (err instanceof TypeError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Type error in request.";
    errorDetails = "Please verify your input types";
  }

  // Send response in the format specified in requirements
  const response: any = {
    success: false,
    message,
  };

  // Only add errorDetails if it exists
  if (errorDetails) {
    response.errorDetails = errorDetails;
  }

  // Add stack trace in development
  if (config.NODE_ENV === "development") {
    response.stack = err?.stack;
  }

  res.status(statusCode).json(response);
};

export default GlobalErrorHandler;
