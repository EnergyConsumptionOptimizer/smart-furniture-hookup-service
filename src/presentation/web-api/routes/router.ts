import { Router } from "express";
import { SmartFurnitureHookupController } from "@presentation/web-api/controllers/SmartFurnitureHookupController";
import { AuthMiddleware } from "@presentation/web-api/middlewares/AuthMiddleware";
import { healthCheck } from "@presentation/web-api/routes/healthCheck";
import { smartFurnitureHookupRoutes } from "@presentation/web-api/routes/smartFurnitureHookupRoutes";
import { internalRoutes } from "@presentation/web-api/routes/internal/internalRoutes";

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
