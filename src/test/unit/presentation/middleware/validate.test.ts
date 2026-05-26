import { validate } from "@presentation/rest/middlewares/validate";
import type { NextFunction } from "express";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { mockRequest } from "@test/unit/presentation/mockRequest";
import { mockResponse } from "@test/unit/presentation/mockResponse";
import { mockSmartFurnitureHookupBathroomSink } from "@test/unit/presentation/controllers/mockData";

describe("validate() middleware", () => {
  const schema = z.object({
    body: z.object({
      name: z.string().nonempty(),
      utilityType: z.string().nonempty(),
      endpoint: z.string().nonempty(),
    }),
    params: z.object({
      id: z.string().nonempty(),
    }),
  });

  const validBody = {
    name: mockSmartFurnitureHookupBathroomSink.name.toString(),
    utilityType: mockSmartFurnitureHookupBathroomSink.utilityType.toString(),
    endpoint: mockSmartFurnitureHookupBathroomSink.endpoint.toString(),
  };

  const validParams = {
    id: mockSmartFurnitureHookupBathroomSink.id.toString(),
  };

  it("should parse and enrich request with valid data and call next", () => {
    const req = mockRequest({ body: validBody, params: validParams });
    const res = mockResponse();
    const next: NextFunction = vi.fn();
    const middleware = validate(schema);

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should throw ZodError when body is invalid", () => {
    const req = mockRequest({ params: validParams });
    const res = mockResponse();
    const next: NextFunction = vi.fn();
    const middleware = validate(schema);

    expect(() => middleware(req, res, next)).toThrow(z.ZodError);
    expect(next).not.toHaveBeenCalled();
  });

  it("should throw ZodError when params are invalid", () => {
    const req = mockRequest({
      body: validBody,
      params: { id: "" },
    });
    const res = mockResponse();
    const next: NextFunction = vi.fn();
    const middleware = validate(schema);

    expect(() => middleware(req, res, next)).toThrow(z.ZodError);
    expect(next).not.toHaveBeenCalled();
  });

  it("should not overwrite body when schema does not include body", () => {
    const paramsOnlySchema = z.object({
      params: z.object({ id: z.string().nonempty() }),
    });
    const req = mockRequest({
      body: { name: "keep-me" },
      params: validParams,
    });
    const res = mockResponse();
    const next: NextFunction = vi.fn();
    const middleware = validate(paramsOnlySchema);

    middleware(req, res, next);

    expect(req.body).toEqual({ name: "keep-me" });
    expect(next).toHaveBeenCalled();
  });
});
