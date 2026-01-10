import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { SmartFurnitureHookupService } from "@domain/ports/SmartFurnitureHookupService";
import { InMemorySmartFurnitureHookupRepository } from "../storage/InMemorySmartFurnitureHookupRepository";
import { SmartFurnitureHookupServiceImpl } from "@application/SmartFurnitureHookupServiceImpl";

import { SmartFurnitureHookup } from "@domain/SmartFurnitureHookup";

import { v4 as uuidv4 } from "uuid";
import {
  InvalidIDError,
  SmartFurnitureHookupEndpointConflictError,
  SmartFurnitureHookupNameConflictError,
  SmartFurnitureHookupNotFoundError,
} from "@domain/errors/errors";
import {
  mockSmartFurnitureHookupFridge,
  mockSmartFurnitureHookupHeater,
  mockSmartFurnitureHookupLamp,
} from "../storage/mockSmartFurnitureHookup";
import { monitoringService } from "../interfaces/web-api/dependencies";

describe("SmartFurnitureHookupService", () => {
  let repository: InMemorySmartFurnitureHookupRepository;
  let smartFurnitureHookupService: SmartFurnitureHookupService;

  beforeAll(() => {
    repository = new InMemorySmartFurnitureHookupRepository();

    smartFurnitureHookupService = new SmartFurnitureHookupServiceImpl(
      repository,
      monitoringService,
    );
  });

  describe("createSmartFurnitureHookup", () => {
    beforeEach(() => {
      repository.clear();
    });

    it("should add new smartFurnitureHookup to the repository", async () => {
      const smartFurnitureHookup = mockSmartFurnitureHookupLamp;

      const result =
        await smartFurnitureHookupService.createSmartFurnitureHookup(
          smartFurnitureHookup.name,
          smartFurnitureHookup.utilityType,
          smartFurnitureHookup.endpoint,
        );
      expect(result.id.value).not.toBe("");
      expect(result.name).toBe(smartFurnitureHookup.name);
      expect(result.utilityType).toBe(smartFurnitureHookup.utilityType);
    });

    it("should throw SmartFurnitureHookupNameConflictError when name conflicts", async () => {
      const existingSmartFurnitureHookup =
        await repository.saveSmartFurnitureHookup(
          mockSmartFurnitureHookupFridge,
        );
      const smartFurnitureHookup = mockSmartFurnitureHookupLamp;

      await expect(
        smartFurnitureHookupService.createSmartFurnitureHookup(
          existingSmartFurnitureHookup.name,
          smartFurnitureHookup.utilityType,
          smartFurnitureHookup.endpoint,
        ),
      ).rejects.toThrow(SmartFurnitureHookupNameConflictError);
    });

    it("should throw SmartFurnitureHookupEndpointConflictError when new name conflicts", async () => {
      const existingSmartFurnitureHookup =
        await repository.saveSmartFurnitureHookup(
          mockSmartFurnitureHookupFridge,
        );
      const smartFurnitureHookup = mockSmartFurnitureHookupLamp;

      await expect(
        smartFurnitureHookupService.createSmartFurnitureHookup(
          smartFurnitureHookup.name,
          smartFurnitureHookup.utilityType,
          existingSmartFurnitureHookup.endpoint,
        ),
      ).rejects.toThrow(SmartFurnitureHookupEndpointConflictError);
    });
  });

  describe("getSmartFurnitureHookups", () => {
    beforeEach(() => {
      repository.clear();
    });

    it("should return the smart furniture hookup from the repository", async () => {
      await repository.saveSmartFurnitureHookup(mockSmartFurnitureHookupFridge);
      await repository.saveSmartFurnitureHookup(mockSmartFurnitureHookupHeater);
      await repository.saveSmartFurnitureHookup(mockSmartFurnitureHookupLamp);

      const result =
        await smartFurnitureHookupService.getSmartFurnitureHookups();

      expect(result).toHaveLength(repository.length());
    });
  });

  describe("getSmartFurnitureHookup", () => {
    let smartFurnitureHookup: SmartFurnitureHookup;

    beforeEach(async () => {
      repository.clear();
      smartFurnitureHookup = await repository.saveSmartFurnitureHookup(
        mockSmartFurnitureHookupLamp,
      );
    });

    it("should return smartFurnitureHookup when valid ID exist", async () => {
      const result = await smartFurnitureHookupService.getSmartFurnitureHookup(
        smartFurnitureHookup.id,
      );

      expect(result).not.toBeNull();
      expect(result?.name).toBe(smartFurnitureHookup.name);
      expect(result?.utilityType).toBe(smartFurnitureHookup.utilityType);
    });

    it("should return null when ID does not exist", async () => {
      const result = await smartFurnitureHookupService.getSmartFurnitureHookup({
        value: uuidv4(),
      });
      expect(result).toBeNull();
    });

    it("should throw InvalidIDError when invalid ID is given", async () => {
      await expect(
        smartFurnitureHookupService.getSmartFurnitureHookup({ value: "abc" }),
      ).rejects.toThrow(InvalidIDError);
    });
  });

  describe("updateSmartFurnitureHookup", () => {
    let smartFurnitureHookup: SmartFurnitureHookup;

    beforeEach(async () => {
      repository.clear();

      smartFurnitureHookup = await repository.saveSmartFurnitureHookup(
        mockSmartFurnitureHookupLamp,
      );
    });

    it("should update smart furniture hookup name successfully", async () => {
      const newName = "Smart Fridge";
      const result =
        await smartFurnitureHookupService.updateSmartFurnitureHookup(
          smartFurnitureHookup.id,
          newName,
          smartFurnitureHookup.endpoint,
        );

      expect(result.id).toBe(smartFurnitureHookup.id);
      expect(result.name).toBe(newName);
      expect(result.endpoint).toBe(smartFurnitureHookup.endpoint);
    });

    it("should update smartFurnitureHookup name successfully", async () => {
      const newEndpoint = "192.168.0.10:5004";

      const result =
        await smartFurnitureHookupService.updateSmartFurnitureHookup(
          smartFurnitureHookup.id,
          smartFurnitureHookup.name,
          newEndpoint,
        );

      expect(result.id).toBe(smartFurnitureHookup.id);
      expect(result.name).toBe(smartFurnitureHookup.name);
      expect(result.endpoint).toBe(newEndpoint);
    });

    it("should throw error when smartFurnitureHookup not found", async () => {
      await expect(
        smartFurnitureHookupService.updateSmartFurnitureHookup(
          { value: uuidv4() },
          "name",
          "endpoint",
        ),
      ).rejects.toThrow(SmartFurnitureHookupNotFoundError);
    });

    it("should throw SmartFurnitureHookupNameConflictError when new name conflicts", async () => {
      const newSmartFurnitureHookup = await repository.saveSmartFurnitureHookup(
        mockSmartFurnitureHookupFridge,
      );

      await expect(
        smartFurnitureHookupService.updateSmartFurnitureHookup(
          smartFurnitureHookup.id,
          newSmartFurnitureHookup.name,
          smartFurnitureHookup.endpoint,
        ),
      ).rejects.toThrow(SmartFurnitureHookupNameConflictError);
    });

    it("should throw ConflictError when new name conflicts", async () => {
      const newSmartFurnitureHookup = await repository.saveSmartFurnitureHookup(
        mockSmartFurnitureHookupFridge,
      );

      await expect(
        smartFurnitureHookupService.updateSmartFurnitureHookup(
          smartFurnitureHookup.id,
          smartFurnitureHookup.name,
          newSmartFurnitureHookup.endpoint,
        ),
      ).rejects.toThrow(SmartFurnitureHookupEndpointConflictError);
    });
  });

  describe("deleteSmartFurnitureHookup", () => {
    let smartFurnitureHookup: SmartFurnitureHookup;

    beforeEach(async () => {
      repository.clear();

      smartFurnitureHookup = await repository.saveSmartFurnitureHookup(
        mockSmartFurnitureHookupFridge,
      );
    });

    it("should delete smartFurnitureHookup successfully", async () => {
      await smartFurnitureHookupService.deleteSmartFurnitureHookup(
        smartFurnitureHookup.id,
      );

      const result = await repository.findSmartFurnitureHookupByID(
        smartFurnitureHookup.id,
      );
      expect(result).toBeNull();
    });

    it("should throw SmartFurnitureHookupNotFoundError when smart furniture hookup doesn't exist", async () => {
      await expect(
        smartFurnitureHookupService.deleteSmartFurnitureHookup({
          value: uuidv4(),
        }),
      ).rejects.toThrow(SmartFurnitureHookupNotFoundError);
    });
  });
});
