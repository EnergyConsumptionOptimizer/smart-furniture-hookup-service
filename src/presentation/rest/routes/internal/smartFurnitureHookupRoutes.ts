import { Router } from "express";
import { SmartFurnitureHookupController } from "@presentation/rest/controllers/SmartFurnitureHookupController";
import { validate } from "@presentation/rest/middlewares/validate";
import { SmartFurnitureHookupIdParamSchema } from "@presentation/SmartFurnitureHookupSchema";

export function smartFurnitureHookupRoutes(
  smartFurnitureHookupController: SmartFurnitureHookupController,
): Router {
  const router = Router();

  router.get("/:id", validate(SmartFurnitureHookupIdParamSchema), (req, res) =>
    smartFurnitureHookupController.getSmartFurnitureHookup(req, res),
  );

  return router;
}
