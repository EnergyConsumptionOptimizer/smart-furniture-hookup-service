import { SmartFurnitureHookupController } from "@interfaces/web-api/controllers/SmartFurnitureHookupController";
import { Router } from "express";

export function smartFurnitureHookupRoutes(
  smartFurnitureHookupController: SmartFurnitureHookupController,
): Router {
  const router = Router();

  router.get("/:id", smartFurnitureHookupController.getSmartFurnitureHookup);

  return router;
}
