import express from "express";
import { apiRouter } from "@interfaces/web-api/dependencies";
import { errorHandler } from "@interfaces/web-api/middlewares/errorHandlerMiddleware";

const app = express();

app.use(express.json());

app.use(apiRouter);

app.use(errorHandler);

export default app;
