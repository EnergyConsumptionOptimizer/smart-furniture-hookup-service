import { AuthRequiredError, ForbiddenError } from "@presentation/errors";
import {
  DomainErrorCode,
  SmartFurnitureHookupNotFoundError,
  SmartFurnitureHookupNameEmptyError,
  UrlEmptyError,
  UtilityTypeEmptyError,
  IdEmptyError,
  InvalidUtilityTypeError,
  NameAlreadyExistsError,
  UrlAlreadyExistsError,
} from "@domain/errors";
import type { NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import type { Logger } from "pino";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { mockRequest } from "@test/unit/presentation/mockRequest";
import { mockResponse } from "@test/unit/presentation/mockResponse";
import { createErrorHandler } from "@presentation/rest/middlewares/errorHandlerMiddleware";

function mockLogger(): Logger {
  return {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    trace: vi.fn(),
    fatal: vi.fn(),
  } as unknown as Logger;
}

describe("errorHandler() middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const logger = mockLogger();
  const errorHandler = createErrorHandler(logger);
  const next: NextFunction = vi.fn();

  it("should call next if headers have already been sent", () => {
    const req = mockRequest();
    const res = mockResponse();
    res.headersSent = true;

    errorHandler(new Error("test"), req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  describe("presentation errors", () => {
    it.each([
      {
        error: new AuthRequiredError(),
        expectedStatus: StatusCodes.UNAUTHORIZED,
        expectedCode: "UNAUTHORIZED",
      },
      {
        error: new ForbiddenError(),
        expectedStatus: StatusCodes.FORBIDDEN,
        expectedCode: "FORBIDDEN",
      },
    ])(
      "should map $error.constructor.name to status $expectedStatus with code $expectedCode",
      ({ error, expectedStatus, expectedCode }) => {
        const req = mockRequest();
        const res = mockResponse();

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
        expect(res.json).toHaveBeenCalledWith({
          code: expectedCode,
          message: error.message,
        });
        expect(logger.warn).toHaveBeenCalled();
      },
    );
  });

  describe("domain errors", () => {
    it.each([
      {
        error: new SmartFurnitureHookupNotFoundError(),
        expectedStatus: StatusCodes.NOT_FOUND,
        expectedCode: DomainErrorCode.NOT_FOUND,
      },
      {
        error: new SmartFurnitureHookupNameEmptyError(),
        expectedStatus: StatusCodes.BAD_REQUEST,
        expectedCode: DomainErrorCode.EMPTY_FIELD,
      },
      {
        error: new UrlEmptyError(),
        expectedStatus: StatusCodes.BAD_REQUEST,
        expectedCode: DomainErrorCode.EMPTY_FIELD,
      },
      {
        error: new UtilityTypeEmptyError(),
        expectedStatus: StatusCodes.BAD_REQUEST,
        expectedCode: DomainErrorCode.EMPTY_FIELD,
      },
      {
        error: new IdEmptyError(),
        expectedStatus: StatusCodes.BAD_REQUEST,
        expectedCode: DomainErrorCode.EMPTY_FIELD,
      },
      {
        error: new InvalidUtilityTypeError("UNKNOWN"),
        expectedStatus: StatusCodes.BAD_REQUEST,
        expectedCode: DomainErrorCode.INVALID_UTILITY_TYPE,
      },
      {
        error: new NameAlreadyExistsError("sink-1"),
        expectedStatus: StatusCodes.CONFLICT,
        expectedCode: DomainErrorCode.UNIQUE_FIELD_ALREADY_EXISTS,
      },
      {
        error: new UrlAlreadyExistsError("http://example.com"),
        expectedStatus: StatusCodes.CONFLICT,
        expectedCode: DomainErrorCode.UNIQUE_FIELD_ALREADY_EXISTS,
      },
    ])(
      "should map $error.constructor.name to status $expectedStatus with code $expectedCode",
      ({ error, expectedStatus, expectedCode }) => {
        const req = mockRequest();
        const res = mockResponse();

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
        expect(res.json).toHaveBeenCalledWith({
          code: expectedCode,
          message: error.message,
        });
        expect(logger.warn).toHaveBeenCalled();
      },
    );
  });

  it("should handle ZodError with validation details", () => {
    const zodError = new ZodError([
      {
        code: "custom",
        message: "Name is required",
        path: ["body", "name"],
      },
      {
        code: "custom",
        message: "Endpoint is required",
        path: ["body", "endpoint"],
      },
    ]);
    const req = mockRequest();
    const res = mockResponse();

    errorHandler(zodError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      code: "VALIDATION_ERROR",
      message: "Invalid request payload",
      errors: {
        "body.name": "Name is required",
        "body.endpoint": "Endpoint is required",
      },
    });
  });

  it("should return 500 for unhandled errors", () => {
    const error = new Error("Unexpected failure");
    const req = mockRequest();
    const res = mockResponse();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    });
    expect(logger.error).toHaveBeenCalled();
  });
});
