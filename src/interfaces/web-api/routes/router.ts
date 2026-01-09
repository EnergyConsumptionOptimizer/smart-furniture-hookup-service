import { Router } from "express";
import { smartFurnitureHookupRoutes } from "@interfaces/web-api/routes/smartFurnitureHookupRoutes";
import { AuthMiddleware } from "@interfaces/web-api/middlewares/AuthMiddleware";
import { SmartFurnitureHookupController } from "@interfaces/web-api/controllers/SmartFurnitureHookupController";
import { internalRoutes } from "@interfaces/web-api/routes/internal/internalRoutes";
import { healthCheck } from "@interfaces/web-api/routes/healthCheck";

export function router(
  smartFurnitureHookupController: SmartFurnitureHookupController,
  authMiddleware: AuthMiddleware,
): Router {
  const router = Router();
  router.get("/health", healthCheck);
  router.use(
    "/api/smart-furniture-hookups",
    smartFurnitureHookupRoutes(smartFurnitureHookupController, authMiddleware),
  );

  router.use("/api/internal", internalRoutes(smartFurnitureHookupController));

  return router;
}
