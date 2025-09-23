import "dotenv/config";
import express from "express";
import { apiRouter } from "./interfaces/web-api/dependencies";
import { errorHandler } from "./interfaces/web-api/middlewares/errorHandlerMiddleware";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in environment variables.");
  process.exit(1);
}

app.use(express.json());
app.use(apiRouter);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log("smart-furniture-hookups service");
  console.log(`Server running on port ${PORT}`);

  console.log("Connecting to MongoDB...");

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB successfully");

  console.log(`Auth API: http://localhost:${PORT}/api/smart-furniture-hookups`);
});
