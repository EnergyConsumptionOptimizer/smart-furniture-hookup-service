// ===== Repository =====
import { MongooseSmartFurnitureHookupRepository } from "@infrastructure/mongo/MongooseSmartFurnitureHookupRepository";
import { SmartFurnitureHookupServiceImpl } from "@application/SmartFurnitureHookupServiceImpl";
import { HTTPMonitoringService } from "@infrastructure/HTTPMonitoringService";
import { SmartFurnitureHookupController } from "@presentation/web-api/controllers/SmartFurnitureHookupController";
import { AuthMiddleware } from "@presentation/web-api/middlewares/AuthMiddleware";
import { router } from "@presentation/web-api/routes/router";

export const smartFurnitureHookupRepository =
  new MongooseSmartFurnitureHookupRepository();

// ===== Services =====
const monitoringService = new HTTPMonitoringService();

const smartFurnitureHookupService = new SmartFurnitureHookupServiceImpl(
  smartFurnitureHookupRepository,
  monitoringService,
);

// ===== Controllers =====
const smartFurnitureHookupController = new SmartFurnitureHookupController(
  smartFurnitureHookupService,
);

// ===== Middlewares =====
export const authMiddleware = new AuthMiddleware();

// ===== Router =====
export const apiRouter = router(smartFurnitureHookupController, authMiddleware);
