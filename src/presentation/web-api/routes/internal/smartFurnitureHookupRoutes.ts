import { Router } from "express";
import { SmartFurnitureHookupController } from "@presentation/web-api/controllers/SmartFurnitureHookupController";

export function smartFurnitureHookupRoutes(
  smartFurnitureHookupController: SmartFurnitureHookupController,
): Router {
  const router = Router();

  router.get("/:id", smartFurnitureHookupController.getSmartFurnitureHookup);

  return router;
}
