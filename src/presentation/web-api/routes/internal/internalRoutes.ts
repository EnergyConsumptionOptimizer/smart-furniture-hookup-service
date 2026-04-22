import { Router } from "express";
import { smartFurnitureHookupRoutes } from "./smartFurnitureHookupRoutes";
import { SmartFurnitureHookupController } from "@presentation/web-api/controllers/SmartFurnitureHookupController";

export function internalRoutes(
  smartFurnitureHookupController: SmartFurnitureHookupController,
): Router {
  const router = Router();

  router.use(
    "/smart-furniture-hookups",
    smartFurnitureHookupRoutes(smartFurnitureHookupController),
  );

  return router;
}
