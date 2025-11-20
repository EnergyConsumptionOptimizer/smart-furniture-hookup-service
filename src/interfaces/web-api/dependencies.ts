import { router } from "./routes/router";

import { SmartFurnitureHookupController } from "./controllers/SmartFurnitureHookupController";
import { SmartFurnitureHookupServiceImpl } from "@application/SmartFurnitureHookupServiceImpl";
import { AuthMiddleware } from "./middlewares/AuthMiddleware";
import { MongooseSmartFurnitureHookupRepository } from "@storage/mongo/MongooseSmartFurnitureHookupRepository";

// ===== Repository =====
export const smartFurnitureHookupRepository =
  new MongooseSmartFurnitureHookupRepository();

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
