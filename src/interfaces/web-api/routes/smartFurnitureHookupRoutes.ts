import { Router } from "express";
import { SmartFurnitureHookupController } from "../controllers/SmartFurnitureHookupController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

export function smartFurnitureHookupRoutes(
  smartFurnitureHookupController: SmartFurnitureHookupController,
  authMiddleware: AuthMiddleware,
): Router {
  const router = Router();

  router
    .route("/")
    .get(
      authMiddleware.authenticate,
      smartFurnitureHookupController.getSmartFurnitureHookups,
    )
    .post(
      authMiddleware.authenticateAdmin,
      smartFurnitureHookupController.createSmartFurnitureHookup,
    );
  router
    .route("/:id")
    .get(
      authMiddleware.authenticate,
      smartFurnitureHookupController.getSmartFurnitureHookup,
    )
    .patch(
      authMiddleware.authenticateAdmin,
      smartFurnitureHookupController.updateSmartFurnitureHookup,
    )
    .delete(
      authMiddleware.authenticateAdmin,
      smartFurnitureHookupController.deleteSmartFurnitureHookup,
    );

  return router;
}
