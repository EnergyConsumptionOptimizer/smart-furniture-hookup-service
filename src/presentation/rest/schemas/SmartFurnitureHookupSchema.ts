import { z } from "zod";

const smartFurnitureHookupId = z.uuid();
const name = z.string().nonempty();
const utilityType = z.string().nonempty();
const endpoint = z.string().nonempty();

export const SmartFurnitureHookupIdParamSchema = z.object({
  params: z.object({ id: smartFurnitureHookupId }),
});

export const CreateSmartFurnitureHookupSchema = z.object({
  body: z.object({
    name,
    utilityType,
    endpoint,
  }),
});

export const UpdateSmartFurnitureHookupSchema = z.object({
  params: z.object({ id: smartFurnitureHookupId }),
  body: z.object({
    name: name.optional(),
    endpoint: endpoint.optional(),
  }),
});
