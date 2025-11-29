import "dotenv/config";
import express from "express";
import { apiRouter } from "./dependencies";
import { errorHandler } from "@interfaces/web-api/middlewares/errorHandlerMiddleware";

const app = express();

app.use(express.json());
app.use(apiRouter);
app.use(errorHandler);

export { app };
