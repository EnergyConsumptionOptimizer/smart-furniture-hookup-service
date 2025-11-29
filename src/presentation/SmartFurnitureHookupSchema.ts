import { z } from "zod";
import { SmartFurnitureHookupID } from "@domain/SmartFurnitureHookupID";

export const smartFurnitureHookupIDSchema = z
  .string()
  .nonempty()
  .transform((value) => ({ value }) as SmartFurnitureHookupID);

export const nameSchema = z.string().nonempty();
export const utilityTypeSchema = z.string().nonempty();
export const endpointSchema = z.string().nonempty();

export const createSmartFurnitureHookupSchema = z.object({
  name: nameSchema,
  utilityType: utilityTypeSchema,
  endpoint: endpointSchema,
});

export const updateSmartFurnitureHookupSchema = z
  .object({
    name: nameSchema.optional(),
    endpoint: endpointSchema.optional(),
  })
  .refine((data) => data.name !== undefined || data.endpoint !== undefined, {
    message: "At least one of 'name' or 'endpoint' is required.",
  });
