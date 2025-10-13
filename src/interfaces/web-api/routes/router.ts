import { SmartFurnitureHookupController } from "../controllers/SmartFurnitureHookupController";
import { Router } from "express";
import { smartFurnitureHookupRoutes } from "./smartFurnitureHookupRoutes";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { internalRoutes } from "./internal/internalRoutes";

export function router(
  smartFurnitureHookupController: SmartFurnitureHookupController,
  authMiddleware: AuthMiddleware,
): Router {
  const router = Router();

  router.use(
    "/api/smart-furniture-hookups",
    smartFurnitureHookupRoutes(smartFurnitureHookupController, authMiddleware),
  );

  router.use("/api/internal", internalRoutes(smartFurnitureHookupController));

  return router;
}
