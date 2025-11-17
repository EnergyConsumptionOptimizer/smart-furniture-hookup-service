import { Router } from "express";

export function router(): Router {
  const router = Router();

  router.use("/api/smart-furniture-hookups");

  return router;
}
