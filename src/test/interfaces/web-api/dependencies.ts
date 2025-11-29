import { InMemorySmartFurnitureHookupRepository } from "../../storage/InMemorySmartFurnitureHookupRepository";
import { SmartFurnitureHookupServiceImpl } from "@application/SmartFurnitureHookupServiceImpl";
import { SmartFurnitureHookupController } from "@interfaces/web-api/controllers/SmartFurnitureHookupController";
import { router } from "@interfaces/web-api/routes/router";
import { AuthMiddleware } from "@interfaces/web-api/middlewares/AuthMiddleware";
import { vi } from "vitest";

// ===== Repository =====
export const smartFurnitureHookupRepository =
  new InMemorySmartFurnitureHookupRepository();

// ===== Services =====
export const smartFurnitureHookupService = new SmartFurnitureHookupServiceImpl(
  smartFurnitureHookupRepository,
);

// ===== Controllers =====
export const smartFurnitureHookupController =
  new SmartFurnitureHookupController(smartFurnitureHookupService);

// ===== Middlewares =====
export const authMiddleware = new AuthMiddleware();

authMiddleware.authenticate = vi.fn(async (req, res, next) => {
  next();
});

authMiddleware.authenticateAdmin = vi.fn(async (req, res, next) => {
  next();
});

// ===== Router =====
export const apiRouter = router(smartFurnitureHookupController, authMiddleware);
