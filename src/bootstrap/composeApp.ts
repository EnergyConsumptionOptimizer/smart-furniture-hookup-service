import type { Express } from "express";
import { MongooseSmartFurnitureHookupRepository } from "@infrastructure/mongo/MongooseSmartFurnitureHookupRepository";
import { HTTPMonitoringService } from "@infrastructure/HTTPMonitoringService";
import { NodeCryptoIdGenerator } from "@infrastructure/NodeCryptoIdGenerator";
import { MongoOutboxEventPublisher } from "@infrastructure/events/MongoOutboxEventPublisher";
import { Logger } from "pino";
import { MongoUnitOfWork } from "@infrastructure/mongo/MongoUnitOfWork";
import { SmartFurnitureHookupServiceImpl } from "@application/SmartFurnitureHookupServiceImpl";
import { SmartFurnitureHookupRepository } from "@domain/ports/SmartFurnitureHookupRepository";
import { MonitoringService } from "@application/outbound/MonitoringService";
import { IdGenerator } from "@application/outbound/IdGenerator";
import { UnitOfWork } from "@application/outbound/UnitOfWork";
import { EventPublisher } from "@application/outbound/EventPublisher";
import { BusinessMetrics } from "@application/outbound/BusinessMetrics";
import { OtelBusinessMetrics } from "@infrastructure/metrics/OtelBusinessMetrics";
import { SmartFurnitureHookupController } from "@presentation/rest/controllers/SmartFurnitureHookupController";
import { AuthMiddleware } from "@presentation/rest/middlewares/AuthMiddleware";
import { router } from "@presentation/rest/routes/router";
import { createApp } from "./app";
import { SmartFurnitureHookupService } from "@application/inbound/SmartFurnitureHookupService";

export interface ComposedApp {
  readonly app: Express;
}

function createInfrastructureLayer(logger: Logger) {
  return {
    repository: new MongooseSmartFurnitureHookupRepository(),
    monitoringService: new HTTPMonitoringService(),
    idGenerator: new NodeCryptoIdGenerator(),
    eventPublisher: new MongoOutboxEventPublisher(
      logger.child({ component: "MongoOutboxEventPublisher" }),
    ),
    uow: new MongoUnitOfWork(logger.child({ component: "MongoUnitOfWork" })),
    metrics: new OtelBusinessMetrics(),
  };
}

function createApplicationLayer(
  repository: SmartFurnitureHookupRepository,
  monitoringService: MonitoringService,
  idGenerator: IdGenerator,
  uow: UnitOfWork,
  eventPublisher: EventPublisher,
  metrics: BusinessMetrics,
) {
  return {
    smartFurnitureHookupService: new SmartFurnitureHookupServiceImpl(
      repository,
      monitoringService,
      idGenerator,
      uow,
      eventPublisher,
      metrics,
    ),
  };
}

function createPresentationLayer(
  smartFurnitureHookupService: SmartFurnitureHookupService,
) {
  const authMiddleware = new AuthMiddleware();
  const smartFurnitureHookupController = new SmartFurnitureHookupController(
    smartFurnitureHookupService,
  );
  return {
    mainRouter: router(smartFurnitureHookupController, authMiddleware),
  };
}

export function composeApp(logger: Logger) {
  const infra = createInfrastructureLayer(logger);

  const application = createApplicationLayer(
    infra.repository,
    infra.monitoringService,
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
