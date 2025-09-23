import "dotenv/config";
import express from "express";
import { apiRouter } from "./interfaces/web-api/dependencies";
import { errorHandler } from "./interfaces/web-api/middlewares/errorHandlerMiddleware";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(apiRouter);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log("smart-furniture-hookups service");
  console.log(`Server running on port ${PORT}`);

  console.log(`Server running on port ${PORT}`);

  console.log(`Auth API: http://localhost:${PORT}/api/smart-furniture-hookups`);
});
