import { Router } from "express";
import { SmartFurnitureHookupController } from "@presentation/rest/controllers/SmartFurnitureHookupController";
import { healthCheck } from "@presentation/rest/routes/healthCheck";
import { smartFurnitureHookupRoutes } from "@presentation/rest/routes/smartFurnitureHookupRoutes";
import { internalRoutes } from "@presentation/rest/routes/internal/internalRoutes";
import { AuthMiddleware } from "@presentation/rest/middlewares/AuthMiddleware";

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
