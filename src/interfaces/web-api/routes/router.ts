import { Router } from "express";
import { smartFurnitureHookupRoutes } from "@interfaces/web-api/routes/smartFurnitureHookupRoutes";
import { AuthMiddleware } from "@interfaces/web-api/middlewares/AuthMiddleware";
import { SmartFurnitureHookupController } from "@interfaces/web-api/controllers/SmartFurnitureHookupController";

export function router(
  smartFurnitureHookupController: SmartFurnitureHookupController,
  authMiddleware: AuthMiddleware,
): Router {
  const router = Router();

  router.use(
    "/api/smart-furniture-hookups",
    smartFurnitureHookupRoutes(smartFurnitureHookupController, authMiddleware),
  );

  return router;
}
