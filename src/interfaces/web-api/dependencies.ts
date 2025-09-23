import { router } from "./routes/router";

import { SmartFurnitureHookupController } from "./controllers/SmartFurnitureHookupController";
import { InMemorySmartFurnitureHookupRepository } from "../../test/storage/InMemorySmartFurnitureHookupRepository";
import { SmartFurnitureHookupServiceImpl } from "../../application/SmartFurnitureHookupServiceImpl";
import { AuthMiddleware } from "./middlewares/AuthMiddleware";

// ===== Repository =====
export const smartFurnitureHookupRepository =
  new InMemorySmartFurnitureHookupRepository();

// ===== Services =====
export const smartFurnitureHookupService = new SmartFurnitureHookupServiceImpl(
  smartFurnitureHookupRepository,
);

// ===== Controllers =====
const smartFurnitureHookupController = new SmartFurnitureHookupController(
  smartFurnitureHookupService,
);

// ===== Middlewares =====
export const authMiddleware = new AuthMiddleware();

// ===== Router =====
export const apiRouter = router(smartFurnitureHookupController, authMiddleware);
