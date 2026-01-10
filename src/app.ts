import express from "express";
import { apiRouter } from "@interfaces/web-api/dependencies";
import { errorHandler } from "@interfaces/web-api/middlewares/errorHandlerMiddleware";

import cookieParser from "cookie-parser";
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(apiRouter);

app.use(errorHandler);

export default app;
