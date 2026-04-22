import express from "express";

import cookieParser from "cookie-parser";
import { errorHandler } from "@presentation/web-api/middlewares/errorHandlerMiddleware";
import { apiRouter } from "./dependencies";
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(apiRouter);

app.use(errorHandler);

export default app;
