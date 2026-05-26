import { Router } from "express";
import { SmartFurnitureHookupController } from "../controllers/SmartFurnitureHookupController";
import { AuthMiddleware } from "@presentation/rest/middlewares/AuthMiddleware";
import { validate } from "@presentation/rest/middlewares/validate";
import {
  CreateSmartFurnitureHookupSchema,
  SmartFurnitureHookupIdParamSchema,
  UpdateSmartFurnitureHookupSchema,
} from "@presentation/rest/schemas/SmartFurnitureHookupSchema";
import { UserRoles } from "@domain/values/UserRole";

export function smartFurnitureHookupRoutes(
  smartFurnitureHookupController: SmartFurnitureHookupController,
  authMiddleware: AuthMiddleware,
): Router {
  const router = Router();

  router.use(authMiddleware.forwardAuth);

  router
    .route("/")
    .get((req, res) =>
      smartFurnitureHookupController.getSmartFurnitureHookups(req, res),
    )
    .post(
      authMiddleware.requireRole(UserRoles.ADMIN),
      validate(CreateSmartFurnitureHookupSchema),
      (req, res) =>
        smartFurnitureHookupController.createSmartFurnitureHookup(req, res),
    );
  router
    .route("/:id")
    .get(validate(SmartFurnitureHookupIdParamSchema), (req, res) =>
      smartFurnitureHookupController.getSmartFurnitureHookup(req, res),
    )
    .patch(
      validate(UpdateSmartFurnitureHookupSchema),
      authMiddleware.requireRole(UserRoles.ADMIN),
      (req, res) =>
        smartFurnitureHookupController.updateSmartFurnitureHookup(req, res),
    )
    .delete(
      validate(SmartFurnitureHookupIdParamSchema),
      authMiddleware.requireRole(UserRoles.ADMIN),
      (req, res) =>
        smartFurnitureHookupController.deleteSmartFurnitureHookup(req, res),
    );

  return router;
}
