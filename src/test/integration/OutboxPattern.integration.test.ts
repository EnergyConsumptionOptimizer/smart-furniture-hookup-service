import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";
import { MongoOutboxEventPublisher } from "@infrastructure/events/MongoOutboxEventPublisher";
import {
  OutboxEvent,
  type OutboxEventDoc,
} from "@infrastructure/events/OutboxEvent";

import { clearDatabase, startMongo, stopMongo } from "@test/mongoSetup";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { MongoUnitOfWork } from "@infrastructure/mongo/MongoUnitOfWork";
import { MongooseSmartFurnitureHookupRepository } from "@infrastructure/mongo/MongooseSmartFurnitureHookupRepository";
import { SmartFurnitureHookupModel } from "@infrastructure/mongo/mongoose/SmartFurnitureHookupModel";
import { aNewSmartFurnitureHookup } from "@test/domainFactories";
import { SmartFurnitureHookupCreatedEvent } from "@domain/events/SmartFurnitureHookupCreatedEvent";
import { NameAlreadyExistsError } from "@domain/errors";
import { seedSmartFurnitureHookup } from "@test/integration/seedSmartFurnitureHookup";

describe("Outbox Pattern (integration) - SmartFurnitureHookup", () => {
  let uow: MongoUnitOfWork;
  let repository: MongooseSmartFurnitureHookupRepository;
  let eventPublisher: MongoOutboxEventPublisher;

  beforeAll(async () => {
    await startMongo();
    uow = new MongoUnitOfWork();
    repository = new MongooseSmartFurnitureHookupRepository();
    eventPublisher = new MongoOutboxEventPublisher();

    await OutboxEvent.createCollection();
    await SmartFurnitureHookupModel.createCollection();
    await SmartFurnitureHookupModel.init();
  });

  afterAll(async () => {
    await stopMongo();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  const saveWithOutbox = async (
    hookup: SmartFurnitureHookup,
  ): Promise<void> => {
    await uow.executeTransactionally(async () => {
      await repository.saveSmartFurnitureHookup(hookup);

      for (const event of hookup.pullDomainEvents()) {
        await eventPublisher.publish(event);
      }
    });
  };

  const findAllOutboxEvents = async (): Promise<OutboxEventDoc[]> => {
    return OutboxEvent.find({}).sort({ createdAt: 1 }).lean().exec();
  };

  it("persists both hookup and outbox event atomically on creation", async () => {
    const hookup = aNewSmartFurnitureHookup();

    await saveWithOutbox(hookup);

    const savedHookup = await SmartFurnitureHookupModel.findById(
      hookup.id.toString(),
    )
      .lean()
      .exec();
    expect(savedHookup).not.toBeNull();
    if (!savedHookup) return;
    expect(savedHookup.name).toBe(hookup.name.toString());

    const outboxDocs = await findAllOutboxEvents();

    expect(outboxDocs).toHaveLength(1);

    expect(outboxDocs[0]).toMatchObject({
      eventType: "SmartFurnitureHookupCreatedEvent",
      aggregateId: hookup.id.toString(),
      aggregateType: "SmartFurnitureHookup",

      payload: expect.objectContaining({
        smartFurnitureHookupId: hookup.id.toString(),
        name: hookup.name.toString(),
        utilityType: hookup.utilityType.toString(),
        endpoint: hookup.endpoint.toString(),
      }),
    });
  });

  it("rolls back both hookup and outbox event on duplicate name conflict", async () => {
    await seedSmartFurnitureHookup(
      "existing-id",
      "Taken Name",
      "http://existing.local",
    );

    const conflictingHookup = aNewSmartFurnitureHookup({
      name: "Taken Name",
    });

    await expect(saveWithOutbox(conflictingHookup)).rejects.toThrow(
      NameAlreadyExistsError,
    );

    const hookupDoc = await SmartFurnitureHookupModel.findById("other-id")
      .lean()
      .exec();
    expect(hookupDoc).toBeNull();

    const outboxDocs = await OutboxEvent.find({ aggregateId: "other-id" })
      .lean()
      .exec();
    expect(outboxDocs).toHaveLength(0);
  });

  it("publishes a SmartFurnitureHookupDeletedEvent via the outbox", async () => {
    const hookup = aNewSmartFurnitureHookup();
    await saveWithOutbox(hookup);

    const existing = await repository.findSmartFurnitureHookupByID(hookup.id);
    if (!existing) return;

    existing.prepareForDeletion();

    await uow.executeTransactionally(async () => {
      await repository.removeSmartFurnitureHookup(existing.id);
      for (const event of existing.pullDomainEvents()) {
        await eventPublisher.publish(event);
      }
    });

    const outboxDocs = await findAllOutboxEvents();
    expect(outboxDocs).toHaveLength(2);
    expect(outboxDocs[0].eventType).toBe("SmartFurnitureHookupCreatedEvent");
    expect(outboxDocs[1]).toMatchObject({
      eventType: "SmartFurnitureHookupDeletedEvent",
      aggregateId: hookup.id.toString(),
    });
  });

  it("throws if event publisher is called outside a UnitOfWork", async () => {
    const hookup = aNewSmartFurnitureHookup();
    const event = new SmartFurnitureHookupCreatedEvent(hookup);

    await expect(eventPublisher.publish(event)).rejects.toThrow(
      "EventPublisher must always be called inside an UnitOfWork",
    );
  });

  it("publishes multiple events from a single aggregate in one transaction", async () => {
    const hookup = aNewSmartFurnitureHookup();
    await saveWithOutbox(hookup);

    const saved = await repository.findSmartFurnitureHookupByID(hookup.id);
    if (!saved) return;

    saved.prepareForDeletion();

    await uow.executeTransactionally(async () => {
      for (const event of saved.pullDomainEvents()) {
        await eventPublisher.publish(event);
      }
    });

    const outboxDocs = await findAllOutboxEvents();
    expect(outboxDocs).toHaveLength(2);
    expect(outboxDocs.map((d) => d.eventType)).toEqual([
      "SmartFurnitureHookupCreatedEvent",
      "SmartFurnitureHookupDeletedEvent",
    ]);
  });
});
