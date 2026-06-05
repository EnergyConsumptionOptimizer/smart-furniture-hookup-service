import type { Express } from "express";
import { MongooseSmartFurnitureHookupRepository } from "@infrastructure/mongo/MongooseSmartFurnitureHookupRepository";
import { NodeCryptoIdGenerator } from "@infrastructure/NodeCryptoIdGenerator";
import { MongoOutboxEventPublisher } from "@infrastructure/events/MongoOutboxEventPublisher";
import { Logger } from "pino";
import { MongoUnitOfWork } from "@infrastructure/mongo/MongoUnitOfWork";
import { SmartFurnitureHookupServiceImpl } from "@application/SmartFurnitureHookupServiceImpl";
import { SmartFurnitureHookupRepository } from "@domain/ports/SmartFurnitureHookupRepository";
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
import { PhysicalSmartFurnitureHookupCommunication } from "@application/outbound/PhysicalSmartFurnitureHookupCommunication";
import { config } from "@bootstrap/config";
import { HTTPPhysicalSmartFurnitureHookupCommunication } from "@infrastructure/HTTPPhysicalSmartFurnitureHookupCommunication";

export interface ComposedApp {
  readonly app: Express;
}

export function createInfrastructureLayer(logger: Logger) {
  return {
    repository: new MongooseSmartFurnitureHookupRepository(),
    physicalSmartFurnitureHookupCommunication:
      new HTTPPhysicalSmartFurnitureHookupCommunication(logger),
    idGenerator: new NodeCryptoIdGenerator(),
    eventPublisher: new MongoOutboxEventPublisher(
      logger.child({ component: "MongoOutboxEventPublisher" }),
    ),
    uow: new MongoUnitOfWork(logger.child({ component: "MongoUnitOfWork" })),
    metrics: new OtelBusinessMetrics(),
  };
}

export function createApplicationLayer(
  repository: SmartFurnitureHookupRepository,
  deviceIngestionUrl: string,
  physicalSmartFurnitureHookupCommunication: PhysicalSmartFurnitureHookupCommunication,
  idGenerator: IdGenerator,
  uow: UnitOfWork,
  eventPublisher: EventPublisher,
  metrics: BusinessMetrics,
) {
  return {
    smartFurnitureHookupService: new SmartFurnitureHookupServiceImpl(
      repository,
      deviceIngestionUrl,
      physicalSmartFurnitureHookupCommunication,
      idGenerator,
      uow,
      eventPublisher,
      metrics,
    ),
  };
}

export function createPresentationLayer(
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

export async function composeApp(logger: Logger): Promise<ComposedApp> {
  const infra = createInfrastructureLayer(logger);

  const application = createApplicationLayer(
    infra.repository,
    config.deviceIngestionUrl,
    infra.physicalSmartFurnitureHookupCommunication,
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
