import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import pino from "pino";
import { MongooseSmartFurnitureHookupRepository } from "@infrastructure/mongo/MongooseSmartFurnitureHookupRepository";
import { clearDatabase, startMongo, stopMongo } from "@test/mongoSetup";
import { SmartFurnitureHookupModel } from "@infrastructure/mongo/mongoose/SmartFurnitureHookupModel";
import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";
import { aSmartFurnitureHookup, validId } from "@test/domainFactories";
import {
  NameAlreadyExistsError,
  SmartFurnitureHookupNotFoundError,
  UrlAlreadyExistsError,
} from "@domain/errors";
import { seedSmartFurnitureHookup } from "@test/integration/seedSmartFurnitureHookup";

describe("MongooseSmartFurnitureHookupRepository (integration)", () => {
  let repository: MongooseSmartFurnitureHookupRepository;

  beforeAll(async () => {
    await startMongo();

    repository = new MongooseSmartFurnitureHookupRepository(
      pino({ level: "silent" }),
    );

    await SmartFurnitureHookupModel.createCollection();
    await SmartFurnitureHookupModel.init();
  });

  afterAll(async () => {
    await stopMongo();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe("saveSmartFurnitureHookup()", () => {
    it("creates a new smart furniture hookup document", async () => {
      const hookup = aSmartFurnitureHookup({
        id: "hookup-1",
        name: "Living Room Light",
        endpoint: "http://local.light/api",
      });

      const result = await repository.saveSmartFurnitureHookup(hookup);

      expect(result).toBeInstanceOf(SmartFurnitureHookup);

      const doc = await SmartFurnitureHookupModel.findById("hookup-1")
        .lean()
        .exec();
      expect(doc).not.toBeNull();
      if (!doc) return;
      expect(doc.name).toBe("Living Room Light");
      expect(doc.endpoint).toBe("http://local.light/api");
    });

    it("throws NameAlreadyExistsError on duplicate name", async () => {
      await seedSmartFurnitureHookup(
        "hookup-1",
        "Living Room Light",
        "http://light1.local",
      );

      const duplicateNameHookup = aSmartFurnitureHookup({
        id: "hookup-2",
        name: "Living Room Light",
        endpoint: "http://light2.local",
      });

      await expect(
        repository.saveSmartFurnitureHookup(duplicateNameHookup),
      ).rejects.toThrow(NameAlreadyExistsError);
    });

    it("throws UrlAlreadyExistsError on duplicate endpoint", async () => {
      await seedSmartFurnitureHookup(
        "hookup-1",
        "Light 1",
        "http://shared.local",
      );

      const duplicateEndpointHookup = aSmartFurnitureHookup({
        id: "hookup-2",
        name: "Light 2",
        endpoint: "http://shared.local",
      });

      await expect(
        repository.saveSmartFurnitureHookup(duplicateEndpointHookup),
      ).rejects.toThrow(UrlAlreadyExistsError);
    });
  });

  describe("findAllSmartFurnitureHookup()", () => {
    it("returns an array of domain entities", async () => {
      await seedSmartFurnitureHookup("id-1", "Light", "http://light.local");
      await seedSmartFurnitureHookup(
        "id-2",
        "Thermostat",
        "http://therm.local",
      );

      const result = await repository.findAllSmartFurnitureHookup();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(SmartFurnitureHookup);
      expect(result[1]).toBeInstanceOf(SmartFurnitureHookup);
    });

    it("returns an empty array when no documents exist", async () => {
      const result = await repository.findAllSmartFurnitureHookup();
      expect(result).toEqual([]);
    });
  });

  describe("findSmartFurnitureHookupByID()", () => {
    it("returns a domain entity when the document exists", async () => {
      await seedSmartFurnitureHookup(
        "target-id",
        "Target",
        "http://target.local",
      );

      const result = await repository.findSmartFurnitureHookupByID(
        validId("target-id"),
      );

      expect(result).toBeInstanceOf(SmartFurnitureHookup);
      if (!result) return;
      expect(result.id.value).toBe("target-id");
    });

    it("returns null when the document does not exist", async () => {
      const result = await repository.findSmartFurnitureHookupByID(
        validId("unknown-id"),
      );

      expect(result).toBeNull();
    });
  });

  describe("updateSmartFurnitureHookup()", () => {
    it("updates an existing document and returns the updated domain entity", async () => {
      await seedSmartFurnitureHookup(
        "update-id",
        "Old Name",
        "http://old.local",
      );

      const updatedHookup = aSmartFurnitureHookup({
        id: "update-id",
        name: "New Name",
        endpoint: "http://new.local",
      });

      await repository.updateSmartFurnitureHookup(updatedHookup);

      const doc = await SmartFurnitureHookupModel.findById("update-id")
        .lean()
        .exec();
      expect(doc?.name).toBe("New Name");
      expect(doc?.endpoint).toBe("http://new.local");
    });

    it("throws SmartFurnitureHookupNotFoundError if document does not exist", async () => {
      const nonExistentHookup = aSmartFurnitureHookup({
        id: "ghost-id",
        name: "Ghost",
        endpoint: "http://ghost.local",
      });

      await expect(
        repository.updateSmartFurnitureHookup(nonExistentHookup),
      ).rejects.toThrow(SmartFurnitureHookupNotFoundError);
    });

    it("throws NameAlreadyExistsError if update causes a name conflict", async () => {
      await seedSmartFurnitureHookup("id-1", "Name A", "http://a.local");
      await seedSmartFurnitureHookup("id-2", "Name B", "http://b.local");

      const conflictingUpdate = aSmartFurnitureHookup({
        id: "id-2",
        name: "Name A",
        endpoint: "http://new-b.local",
      });

      await expect(
        repository.updateSmartFurnitureHookup(conflictingUpdate),
      ).rejects.toThrow(NameAlreadyExistsError);
    });
  });

  describe("removeSmartFurnitureHookup()", () => {
    it("deletes the document from the database", async () => {
      await seedSmartFurnitureHookup(
        "delete-id",
        "To Delete",
        "http://delete.local",
      );

      await repository.removeSmartFurnitureHookup(validId("delete-id"));

      const doc = await SmartFurnitureHookupModel.findById("delete-id")
        .lean()
        .exec();
      expect(doc).toBeNull();
    });

    it("throws SmartFurnitureHookupNotFoundError if trying to remove non-existent document", async () => {
      await expect(
        repository.removeSmartFurnitureHookup(validId("non-existent-id")),
      ).rejects.toThrow(SmartFurnitureHookupNotFoundError);
    });
  });
});
