import { describe, expect, it } from "vitest";

import { aSmartFurnitureHookup } from "@test/domainFactories";
import { SmartFurnitureHookupDocument } from "@infrastructure/mongo/mongoose/SmartFurnitureHookupDocument";
import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";
import { UtilityTypeEnum } from "@domain/values/UtilityType";
import { SmartFurnitureHookupMapper } from "@infrastructure/mongo/mongoose/SmartFurnitureHookupModel";

describe("SmartFurnitureHookupMapper", () => {
  describe("From Persistence to Domain", () => {
    it("should map a Mongoose Document to a domain SmartFurnitureHookup entity", () => {
      const mockDoc: Partial<SmartFurnitureHookupDocument> = {
        _id: "sfh-123",
        name: "Living Room Desk",
        utilityType: UtilityTypeEnum.GAS,
        endpoint: "https://192.168.1.50/api/hookup",
      };

      const result = SmartFurnitureHookupMapper.toDomain(
        mockDoc as SmartFurnitureHookupDocument,
      );

      expect(result).toBeInstanceOf(SmartFurnitureHookup);

      expect(result.id.value).toBe("sfh-123");

      expect(result.pullDomainEvents()).toHaveLength(0);
    });
  });

  describe("From Domain to Persistence", () => {
    it("should map a domain SmartFurnitureHookup to a persistence object", () => {
      const domainEntity = aSmartFurnitureHookup();
      const result = SmartFurnitureHookupMapper.toPersistence(domainEntity);

      expect(result).toEqual({
        _id: domainEntity.id.toString(),
        name: domainEntity.name.toString(),
        utilityType: domainEntity.utilityType.toString(),
        endpoint: domainEntity.endpoint.toString(),
      });
    });
  });
});
