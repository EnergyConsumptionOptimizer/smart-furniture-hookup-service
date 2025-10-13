import { NextFunction, Request, Response } from "express";
import {
  InvalidUtilityTypeError,
  InvalidIDError,
  SmartFurnitureHookupEndpointConflictError,
  SmartFurnitureHookupNameConflictError,
  SmartFurnitureHookupNotFoundError,
} from "../../../domain/errors/errors";

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

  console.log(error);
  return response.status(500).send();
};
