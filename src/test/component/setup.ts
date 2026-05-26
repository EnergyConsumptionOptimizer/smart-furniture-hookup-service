import { pino } from "pino";
import { vi } from "vitest";
import {
  composeApp,
  createApplicationLayer,
  createInfrastructureLayer,
  createPresentationLayer,
} from "@bootstrap/composeApp";
import { createApp } from "@bootstrap/app";
import { MonitoringService } from "@application/outbound/MonitoringService";

vi.mock("@bootstrap/config", () => ({
  config: {
    port: 3000,
    mongo: { uri: "mongodb://placeholder" },
    logLevel: "silent" as const,
    skipSeed: false,
    monitoringServiceUrl: "http://localhost:3001",
    appName: "test-smart-furniture-hookup-service",
  },
}));

export { clearDatabase, startMongo, stopMongo } from "@test/mongoSetup";

export interface ComponentTestContext {
  app: Awaited<ReturnType<typeof composeApp>>["app"];
}

export async function composeAppForComponentTest(): Promise<ComponentTestContext> {
  const logger = pino({ level: "silent" });

  const infra = createInfrastructureLayer(logger);

  const mockMonitoringService: MonitoringService = {
    registerSmartFurnitureHookup: vi.fn().mockResolvedValue(undefined),
    disconnectSmartFurnitureHookup: vi.fn().mockResolvedValue(undefined),
  };

  const application = createApplicationLayer(
    infra.repository,
    mockMonitoringService,
    infra.idGenerator,
    infra.uow,
    infra.eventPublisher,
    infra.metrics,
  );

  const presentation = createPresentationLayer(
    application.smartFurnitureHookupService,
  );

  const app = createApp(presentation.mainRouter, logger);

  return { app };
}
