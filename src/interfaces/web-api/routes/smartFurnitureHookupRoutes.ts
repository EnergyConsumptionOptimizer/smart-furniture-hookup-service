import { Router } from "express";
import { SmartFurnitureHookupController } from "../controllers/SmartFurnitureHookupController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

export function smartFurnitureHookupRoutes(
  smartFurnitureHookupController: SmartFurnitureHookupController,
  authMiddleware: AuthMiddleware,
): Router {
  const router = Router();

  router.get(
    "/",
    authMiddleware.authenticate,
    smartFurnitureHookupController.getSmartFurnitureHookups,
  );
  router.post(
    "/",
    authMiddleware.authenticateAdmin,
    smartFurnitureHookupController.createSmartFurnitureHookup,
  );
  router.get(
    "/:id",
    authMiddleware.authenticate,
    smartFurnitureHookupController.getSmartFurnitureHookup,
  );
  router.patch(
    "/:id",
    authMiddleware.authenticateAdmin,
    smartFurnitureHookupController.updateSmartFurnitureHookup,
  );
  router.delete(
    "/:id",
    authMiddleware.authenticateAdmin,
    smartFurnitureHookupController.deleteSmartFurnitureHookup,
  );

  return router;
}
