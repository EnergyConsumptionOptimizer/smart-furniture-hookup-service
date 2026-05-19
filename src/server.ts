import "dotenv/config";
import { createLogger } from "./logger";
import { config } from "./bootstrap/config";
import { startInstrumentation } from "./instrumentation";
import { connectMongo } from "./bootstrap/mongoConnection";
import { composeApp } from "./bootstrap/composeApp";
import { setupGracefulShutdown } from "./bootstrap/shutdown";

const rootLogger = createLogger(config);
const logger = rootLogger.child({ component: "Server" });
const sdk = startInstrumentation(rootLogger);

async function start(): Promise<void> {
  await connectMongo(config.mongo.uri, logger);

  const composed = composeApp(rootLogger);

  const server = composed.app.listen(config.port, () => {
    logger.info({ port: config.port }, "listening");
  });

  setupGracefulShutdown(server, composed, sdk, logger);
}

void start();
