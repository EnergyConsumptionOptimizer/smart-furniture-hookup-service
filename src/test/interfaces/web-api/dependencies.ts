import { InMemorySmartFurnitureHookupRepository } from "../../storage/InMemorySmartFurnitureHookupRepository";
import { SmartFurnitureHookupServiceImpl } from "@application/SmartFurnitureHookupServiceImpl";
import { vi } from "vitest";
import { HTTPMonitoringService } from "@infrastructure/HTTPMonitoringService";
import { SmartFurnitureHookupController } from "@presentation/web-api/controllers/SmartFurnitureHookupController";
import { AuthMiddleware } from "@presentation/web-api/middlewares/AuthMiddleware";
import { router } from "@presentation/web-api/routes/router";

// ===== Repository =====
export const smartFurnitureHookupRepository =
  new InMemorySmartFurnitureHookupRepository();

// ===== Services =====
export const monitoringService = new HTTPMonitoringService();

monitoringService.registerSmartFurnitureHookup = vi
  .fn()
  .mockResolvedValue(undefined);
monitoringService.disconnectSmartFurnitureHookup = vi
  .fn()
  .mockResolvedValue(undefined);

export const smartFurnitureHookupService = new SmartFurnitureHookupServiceImpl(
  smartFurnitureHookupRepository,
  monitoringService,
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
