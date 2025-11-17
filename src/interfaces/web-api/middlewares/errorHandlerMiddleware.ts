import { NextFunction, Request, Response } from "express";
import {
  InvalidUtilityTypeError,
  InvalidIDError,
  SmartFurnitureHookupEndpointConflictError,
  SmartFurnitureHookupNameConflictError,
  SmartFurnitureHookupNotFoundError,
} from "@domain/errors/errors";
import axios from "axios";
import { InvalidTokenError } from "@interfaces/web-api/middlewares/authMiddewareErrors";
import { ZodError } from "zod";

const msgError = (message: string) => {
  return { error: message };
};

export const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  next: NextFunction,
) => {
  void next;

  if (error instanceof ZodError) {
    return response.status(400).json({
      error: "ValidationError",
      message: "Invalid request payload",
      code: "VALIDATION_ERROR",
      details: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      })),
    });
  }

  if (error instanceof InvalidIDError) {
    return response.status(400).json(msgError(error.message));
  }

  if (error instanceof InvalidUtilityTypeError) {
    return response.status(400).json(msgError(error.message));
  }

  if (error instanceof SmartFurnitureHookupNotFoundError) {
    return response.status(404).json(msgError(error.message));
  }

  if (
    error instanceof SmartFurnitureHookupNameConflictError ||
    error instanceof SmartFurnitureHookupEndpointConflictError
  ) {
    return response.status(409).json(msgError(error.message));
  }

  if (error instanceof InvalidTokenError) {
    return response.status(403).json(msgError(error.message));
  }

  if (
    axios.isAxiosError(error) &&
    (error.response?.status === 401 || error.response?.status === 403)
  ) {
    return response.status(error.response?.status).json(error.response?.data);
  }

  return response.status(500).send();
};
