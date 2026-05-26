import { z } from "zod";

export const getIngestingEndpointResponse = z.object({
  endpoint: z.string().nonempty(),
});
