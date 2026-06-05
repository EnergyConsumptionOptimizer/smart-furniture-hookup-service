import type { SmartFurnitureHookupRepository } from "@domain/ports/SmartFurnitureHookupRepository";
import type { IdGenerator } from "@application/outbound/IdGenerator";
import type { UnitOfWork } from "@application/outbound/UnitOfWork";
import type { EventPublisher } from "@application/outbound/EventPublisher";
import type { BusinessMetrics } from "@application/outbound/BusinessMetrics";
import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";
import { SmartFurnitureHookupNotFoundError } from "@domain/errors";
import { SmartFurnitureHookupCreatedEvent } from "@domain/events/SmartFurnitureHookupCreatedEvent";

import { beforeEach, describe, expect, it } from "vitest";
import { mock, type MockProxy } from "vitest-mock-extended";
import { SmartFurnitureHookupServiceImpl } from "@application/SmartFurnitureHookupServiceImpl";
import {
  aSmartFurnitureHookup,
  validEndpointUrl,
  validSmartFurnitureHookupName,
  validUtilityType,
} from "@test/domainFactories";
import { SmartFurnitureHookupDeletedEvent } from "@domain/events/SmartFurnitureHookupDeletedEvent";
import { PhysicalSmartFurnitureHookupCommunication } from "@application/outbound/PhysicalSmartFurnitureHookupCommunication";

describe("SmartFurnitureHookupServiceImpl", () => {
  let repository: MockProxy<SmartFurnitureHookupRepository>;
  let physicalSmartFurnitureHookupCommunication: MockProxy<PhysicalSmartFurnitureHookupCommunication>;
  let idGenerator: MockProxy<IdGenerator>;
  let uow: MockProxy<UnitOfWork>;
  let eventPublisher: MockProxy<EventPublisher>;
  let metrics: MockProxy<BusinessMetrics>;
  let service: SmartFurnitureHookupServiceImpl;

  const mockID = "mockID";
  const deviceIngestionUrl = "http://gateway:80";

  beforeEach(() => {
    repository = mock<SmartFurnitureHookupRepository>();
    physicalSmartFurnitureHookupCommunication =
      mock<PhysicalSmartFurnitureHookupCommunication>();
    idGenerator = mock<IdGenerator>();
    uow = mock<UnitOfWork>();
    eventPublisher = mock<EventPublisher>();
    metrics = mock<BusinessMetrics>();

    idGenerator.generate.mockReturnValue(mockID);

    uow.executeTransactionally.mockImplementation(async (fn) =>
      (fn as () => Promise<unknown>)(),
    );

    service = new SmartFurnitureHookupServiceImpl(
      repository,
      deviceIngestionUrl,
      physicalSmartFurnitureHookupCommunication,
      idGenerator,
      uow,
      eventPublisher,
      metrics,
    );
  });

  describe("createSmartFurnitureHookup()", () => {
    it("should create a smart furniture hookup, connect it and publish event via outbox", async () => {
      const params = {
        name: validSmartFurnitureHookupName().toString(),
        utilityType: validUtilityType().toString(),
        endpoint: validEndpointUrl().toString(),
      };

      const result = await service.createSmartFurnitureHookup(
        params.name,
        params.utilityType,
        params.endpoint,
      );

      expect(result).toBeInstanceOf(SmartFurnitureHookup);

      const hookup = result as SmartFurnitureHookup;

      expect(hookup.id.toString()).toBe(mockID);
      expect(hookup.name.toString()).toBe(params.name);
      expect(hookup.utilityType.toString()).toBe(params.utilityType);
      expect(hookup.endpoint.value).toBe(params.endpoint);

      expect(uow.executeTransactionally).toHaveBeenCalled();
      expect(repository.saveSmartFurnitureHookup).toHaveBeenCalledWith(hookup);

      expect(
        physicalSmartFurnitureHookupCommunication.updateIngestingEndpoint,
      ).toHaveBeenCalledWith(
        params.endpoint,
        `${deviceIngestionUrl}/api/measurements?smart_furniture_hookup_id=${mockID}`,
      );

      expect(eventPublisher.publish).toHaveBeenCalledTimes(1);
      expect(eventPublisher.publish).toHaveBeenCalledWith(
        expect.any(SmartFurnitureHookupCreatedEvent),
      );
    });

    it("should return an Error if value object validation fails", async () => {
      const params = {
        name: "",
        utilityType: "",
        endpoint: "",
      };
      const result = await service.createSmartFurnitureHookup(
        params.name,
        params.utilityType,
        params.endpoint,
      );

      expect(result).toBeInstanceOf(Error);
      expect(repository.saveSmartFurnitureHookup).not.toHaveBeenCalled();
    });
  });

  describe("getSmartFurnitureHookup()", () => {
    it("should return the smart furniture hookup when found", async () => {
      const hookup = aSmartFurnitureHookup();
      repository.findSmartFurnitureHookupByID.mockResolvedValue(hookup);

      const result = await service.getSmartFurnitureHookup("found-id");

      expect(result).toBeInstanceOf(SmartFurnitureHookup);
      expect((result as SmartFurnitureHookup).name.toString()).toBe(
        aSmartFurnitureHookup().name.toString(),
      );
    });

    it("should return SmartFurnitureHookupNotFoundError when not found", async () => {
      repository.findSmartFurnitureHookupByID.mockResolvedValue(null);

      const result = await service.getSmartFurnitureHookup("unknown-id");

      expect(result).toBeInstanceOf(SmartFurnitureHookupNotFoundError);
    });

    it("should return an error if the requested ID format is invalid", async () => {
      const result = await service.getSmartFurnitureHookup("");
      expect(result).toBeInstanceOf(Error);
    });

    describe("getSmartFurnitureHookups()", () => {
      it("should return a list of hookups", async () => {
        const hookups = [
          aSmartFurnitureHookup({ id: "id-1", name: "Desk 1" }),
          aSmartFurnitureHookup({ id: "id-2", name: "Desk 2" }),
        ];

        repository.findAllSmartFurnitureHookup.mockResolvedValue(hookups);

        const result = await service.getSmartFurnitureHookups();

        expect(result).toHaveLength(2);
        expect(result[0].name.value).toBe("Desk 1");
        expect(result[1].name.value).toBe("Desk 2");
      });

      it("should return an empty array when no hookups exist", async () => {
        repository.findAllSmartFurnitureHookup.mockResolvedValue([]);

        const result = await service.getSmartFurnitureHookups();

        expect(result).toEqual([]);
      });
    });
    describe("updateSmartFurnitureHookup()", () => {
      it("should update properties, re-connect it to the physical hookup if endpoint was updated, and save", async () => {
        const existingHookup = aSmartFurnitureHookup({
          id: "update-id",
          name: "Old Name",
          endpoint: "http://old.local",
        });
        existingHookup.pullDomainEvents();

        repository.findSmartFurnitureHookupByID.mockResolvedValue(
          existingHookup,
        );

        const result = await service.updateSmartFurnitureHookup(
          "update-id",
          "New Name",
          "http://new.local",
        );

        expect(result).toBeInstanceOf(SmartFurnitureHookup);
        const hookup = result as SmartFurnitureHookup;

        expect(hookup.name.value).toBe("New Name");
        expect(hookup.endpoint.value).toBe("http://new.local");

        expect(
          physicalSmartFurnitureHookupCommunication.updateIngestingEndpoint,
        ).toHaveBeenCalled();

        expect(repository.updateSmartFurnitureHookup).toHaveBeenCalledWith(
          hookup,
        );
      });

      it("should only update provided fields", async () => {
        const existingHookup = aSmartFurnitureHookup({
          id: "update-id",
          name: "Old Name",
          endpoint: "http://old.local",
        });

        repository.findSmartFurnitureHookupByID.mockResolvedValue(
          existingHookup,
        );

        await service.updateSmartFurnitureHookup("update-id", "New Name");

        expect(existingHookup.name.value).toBe("New Name");
        expect(existingHookup.endpoint.value).toBe("http://old.local");

        expect(
          physicalSmartFurnitureHookupCommunication.updateIngestingEndpoint,
        ).not.toHaveBeenCalled();
      });

      it("should return SmartFurnitureHookupNotFoundError when entity does not exist", async () => {
        repository.findSmartFurnitureHookupByID.mockResolvedValue(null);

        const result = await service.updateSmartFurnitureHookup(
          "unknown-id",
          "New Name",
        );

        expect(result).toBeInstanceOf(SmartFurnitureHookupNotFoundError);
      });
    });

    describe("deleteSmartFurnitureHookup()", () => {
      it("should delete the hookup, disconnect monitoring, and publish deletion event", async () => {
        const existingHookup = aSmartFurnitureHookup({ id: "delete-id" });
        existingHookup.pullDomainEvents();

        repository.findSmartFurnitureHookupByID.mockResolvedValue(
          existingHookup,
        );

        const result = await service.deleteSmartFurnitureHookup("delete-id");

        expect(result).toBeUndefined();

        expect(uow.executeTransactionally).toHaveBeenCalled();
        expect(
          physicalSmartFurnitureHookupCommunication.updateIngestingEndpoint,
        ).toHaveBeenCalledWith(existingHookup.endpoint.value, "");
        expect(repository.removeSmartFurnitureHookup).toHaveBeenCalledWith(
          existingHookup.id,
        );

        expect(eventPublisher.publish).toHaveBeenCalledTimes(1);
        expect(eventPublisher.publish).toHaveBeenCalledWith(
          expect.any(SmartFurnitureHookupDeletedEvent),
        );
      });

      it("should return SmartFurnitureHookupNotFoundError when not found", async () => {
        repository.findSmartFurnitureHookupByID.mockResolvedValue(null);

        const result = await service.deleteSmartFurnitureHookup("unknown-id");

        expect(result).toBeInstanceOf(SmartFurnitureHookupNotFoundError);
        expect(repository.removeSmartFurnitureHookup).not.toHaveBeenCalled();
      });
    });
  });
});
