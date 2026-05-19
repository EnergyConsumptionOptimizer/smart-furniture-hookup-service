import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";
import {
  NameAlreadyExistsError,
  SmartFurnitureHookupNotFoundError,
  UrlAlreadyExistsError,
} from "@domain/errors";
import { mongoSessionContext } from "@infrastructure/mongo/mongoSessionContext";
import {
  SmartFurnitureHookupMapper,
  SmartFurnitureHookupModel,
} from "@infrastructure/mongo/mongoose/SmartFurnitureHookupModel";
import { MongooseSmartFurnitureHookupRepository } from "@infrastructure/mongo/MongooseSmartFurnitureHookupRepository";
import { aSmartFurnitureHookup, validId } from "@test/domainFactories";
import { MongoServerError } from "mongodb";
import type { ClientSession } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UtilityTypeEnum } from "@domain/values/UtilityType";
import { SmartFurnitureHookupDocument } from "@infrastructure/mongo/mongoose/SmartFurnitureHookupDocument";

vi.mock("@infrastructure/mongo/mongoose/SmartFurnitureHookupModel", () => ({
  SmartFurnitureHookupModel: Object.assign(vi.fn(), {
    find: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
  }),
  SmartFurnitureHookupMapper: {
    toPersistence: vi.fn(),
    toDomain: vi.fn(),
  },
}));

vi.mock("@infrastructure/mongo/mongoSessionContext", () => ({
  mongoSessionContext: {
    getStore: vi.fn(),
  },
}));

function aSmartFurnitureHookupDoc(
  overrides?: Partial<SmartFurnitureHookupDocument>,
): SmartFurnitureHookupDocument {
  return {
    _id: "sfh-1",
    name: "testName",
    utilityType: UtilityTypeEnum.ELECTRICITY,
    endpoint: "testEndpoint",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as SmartFurnitureHookupDocument;
}

function mockExecChain(mockFn: ReturnType<typeof vi.fn>, returnValue: unknown) {
  mockFn.mockReturnValue({
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(returnValue),
  });
}

function makeDuplicateKeyError(field: "name" | "endpoint"): MongoServerError {
  const error = new MongoServerError({ message: "duplicate key" });
  error.code = 11000;
  error.keyPattern = { [field]: 1 };
  return error;
}

describe("MongooseSmartFurnitureHookupRepository", () => {
  let repository: MongooseSmartFurnitureHookupRepository;
  let mockSession: ClientSession;
  let mockDomainEntity: SmartFurnitureHookup;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new MongooseSmartFurnitureHookupRepository();
    mockSession = { id: "test-session" } as unknown as ClientSession;
    mockDomainEntity = aSmartFurnitureHookup();

    vi.mocked(mongoSessionContext.getStore).mockReturnValue(mockSession);
    vi.mocked(SmartFurnitureHookupMapper.toPersistence).mockReturnValue({
      _id: "sfh-1",
      name: "testName",
      utilityType: UtilityTypeEnum.ELECTRICITY,
      endpoint: "testEndpoint",
    });
    vi.mocked(SmartFurnitureHookupMapper.toDomain).mockReturnValue(
      mockDomainEntity,
    );
  });

  describe("saveSmartFurnitureHookup()", () => {
    it("should save the document and return the domain entity", async () => {
      const savedDoc = aSmartFurnitureHookupDoc();
      const saveMock = vi.fn().mockResolvedValue(savedDoc);
      vi.mocked(SmartFurnitureHookupModel).mockImplementation(
        class {
          save = saveMock;
        } as never,
      );

      const result =
        await repository.saveSmartFurnitureHookup(mockDomainEntity);

      expect(SmartFurnitureHookupMapper.toPersistence).toHaveBeenCalledWith(
        mockDomainEntity,
      );
      expect(saveMock).toHaveBeenCalledWith({ session: mockSession });
      expect(SmartFurnitureHookupMapper.toDomain).toHaveBeenCalledWith(
        savedDoc,
      );
      expect(result).toBe(mockDomainEntity);
    });
    it("should throw NameAlreadyExistsError on duplicate key on name field", async () => {
      const saveMock = vi.fn().mockRejectedValue(makeDuplicateKeyError("name"));
      vi.mocked(SmartFurnitureHookupModel).mockImplementation(
        class {
          save = saveMock;
        } as never,
      );

      await expect(
        repository.saveSmartFurnitureHookup(mockDomainEntity),
      ).rejects.toThrow(NameAlreadyExistsError);
    });

    it("should throw UrlAlreadyExistsError on duplicate key on endpoint field", async () => {
      const saveMock = vi
        .fn()
        .mockRejectedValue(makeDuplicateKeyError("endpoint"));
      vi.mocked(SmartFurnitureHookupModel).mockImplementation(
        class {
          save = saveMock;
        } as never,
      );

      await expect(
        repository.saveSmartFurnitureHookup(mockDomainEntity),
      ).rejects.toThrow(UrlAlreadyExistsError);
    });

    it("should rethrow unexpected database errors", async () => {
      const saveMock = vi.fn().mockRejectedValue(new Error("connection lost"));
      vi.mocked(SmartFurnitureHookupModel).mockImplementation(
        class {
          save = saveMock;
        } as never,
      );

      await expect(
        repository.saveSmartFurnitureHookup(mockDomainEntity),
      ).rejects.toThrow("connection lost");
    });
  });

  describe("findAllSmartFurnitureHookup()", () => {
    it("should return all domain entities", async () => {
      const docs = [
        aSmartFurnitureHookupDoc({ _id: "sfh-1", name: "First" }),
        aSmartFurnitureHookupDoc({ _id: "sfh-2", name: "Second" }),
      ];
      mockExecChain(vi.mocked(SmartFurnitureHookupModel.find), docs);
      vi.mocked(SmartFurnitureHookupMapper.toDomain)
        .mockReturnValueOnce(
          aSmartFurnitureHookup({ id: "sfh-1", name: "First" }),
        )
        .mockReturnValueOnce(
          aSmartFurnitureHookup({ id: "sfh-2", name: "Second" }),
        );

      const result = await repository.findAllSmartFurnitureHookup();

      expect(SmartFurnitureHookupModel.find).toHaveBeenCalledWith();
      expect(SmartFurnitureHookupMapper.toDomain).toHaveBeenCalledTimes(2);
      expect(result[0]).toBeInstanceOf(SmartFurnitureHookup);
      expect(result[1]).toBeInstanceOf(SmartFurnitureHookup);
    });

    it("should return an empty array when no hookups exist", async () => {
      mockExecChain(vi.mocked(SmartFurnitureHookupModel.find), []);

      const result = await repository.findAllSmartFurnitureHookup();

      expect(result).toEqual([]);
    });
  });

  describe("findSmartFurnitureHookupByID()", () => {
    it("should return a domain entity when the document exists", async () => {
      const doc = aSmartFurnitureHookupDoc({ _id: "sfh-1" });
      mockExecChain(vi.mocked(SmartFurnitureHookupModel.findById), doc);

      const result = await repository.findSmartFurnitureHookupByID(
        validId("sfh-1"),
      );

      expect(SmartFurnitureHookupModel.findById).toHaveBeenCalledWith("sfh-1");
      expect(SmartFurnitureHookupMapper.toDomain).toHaveBeenCalledWith(doc);
      expect(result).toBeInstanceOf(SmartFurnitureHookup);
    });

    it("should return null when the document does not exist", async () => {
      mockExecChain(vi.mocked(SmartFurnitureHookupModel.findById), null);

      const result = await repository.findSmartFurnitureHookupByID(
        validId("unknown-id"),
      );

      expect(result).toBeNull();
    });
  });

  describe("updateSmartFurnitureHookup()", () => {
    it("should update and return the domain entity", async () => {
      const updatedDoc = aSmartFurnitureHookupDoc({ name: "Updated Name" });
      vi.mocked(SmartFurnitureHookupModel.findByIdAndUpdate).mockReturnValue({
        exec: vi.fn().mockResolvedValue(updatedDoc),
      } as never);

      await repository.updateSmartFurnitureHookup(mockDomainEntity);

      expect(SmartFurnitureHookupModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockDomainEntity.id.value,
        {
          name: mockDomainEntity.name,
          endpoint: mockDomainEntity.endpoint,
        },
        { session: mockSession, runValidators: true },
      );
    });

    it("should throw SmartFurnitureHookupNotFoundError when no document is found", async () => {
      vi.mocked(SmartFurnitureHookupModel.findByIdAndUpdate).mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      } as never);

      await expect(
        repository.updateSmartFurnitureHookup(mockDomainEntity),
      ).rejects.toThrow(SmartFurnitureHookupNotFoundError);
    });

    it("should throw NameAlreadyExistsError on duplicate key on name field", async () => {
      vi.mocked(SmartFurnitureHookupModel.findByIdAndUpdate).mockReturnValue({
        exec: vi.fn().mockRejectedValue(makeDuplicateKeyError("name")),
      } as never);

      await expect(
        repository.updateSmartFurnitureHookup(mockDomainEntity),
      ).rejects.toThrow(NameAlreadyExistsError);
    });

    it("should throw UrlAlreadyExistsError on duplicate key on endpoint field", async () => {
      vi.mocked(SmartFurnitureHookupModel.findByIdAndUpdate).mockReturnValue({
        exec: vi.fn().mockRejectedValue(makeDuplicateKeyError("endpoint")),
      } as never);

      await expect(
        repository.updateSmartFurnitureHookup(mockDomainEntity),
      ).rejects.toThrow(UrlAlreadyExistsError);
    });

    it("should rethrow unexpected database errors", async () => {
      const dbError = new Error("update failed");
      vi.mocked(SmartFurnitureHookupModel.findByIdAndUpdate).mockReturnValue({
        exec: vi.fn().mockRejectedValue(dbError),
      } as never);

      await expect(
        repository.updateSmartFurnitureHookup(mockDomainEntity),
      ).rejects.toThrow("update failed");
    });
  });

  describe("removeSmartFurnitureHookup()", () => {
    it("should delete the hookup by id within the active session", async () => {
      const doc = aSmartFurnitureHookupDoc();
      vi.mocked(SmartFurnitureHookupModel.findByIdAndDelete).mockReturnValue({
        exec: vi.fn().mockResolvedValue(doc),
      } as never);

      await repository.removeSmartFurnitureHookup(validId("sfh-1"));

      expect(SmartFurnitureHookupModel.findByIdAndDelete).toHaveBeenCalledWith(
        "sfh-1",
        { session: mockSession },
      );
    });

    it("should throw SmartFurnitureHookupNotFoundError when no document is found", async () => {
      vi.mocked(SmartFurnitureHookupModel.findByIdAndDelete).mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      } as never);

      await expect(
        repository.removeSmartFurnitureHookup(validId("unknown-id")),
      ).rejects.toThrow(SmartFurnitureHookupNotFoundError);
    });

    it("should rethrow unexpected database errors", async () => {
      const dbError = new Error("delete failed");
      vi.mocked(SmartFurnitureHookupModel.findByIdAndDelete).mockReturnValue({
        exec: vi.fn().mockRejectedValue(dbError),
      } as never);

      await expect(
        repository.removeSmartFurnitureHookup(validId("sfh-1")),
      ).rejects.toThrow("delete failed");
    });
  });
});
