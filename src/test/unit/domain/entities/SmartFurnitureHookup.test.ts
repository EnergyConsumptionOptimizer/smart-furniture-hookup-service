import { describe, expect, it } from "vitest";
import {
  validEndpointUrl,
  validId,
  validSmartFurnitureHookupName,
  validUtilityType,
} from "@test/domainFactories";
import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";
import { SmartFurnitureHookupCreatedEvent } from "@domain/events/SmartFurnitureHookupCreatedEvent";
import { SmartFurnitureHookupDeletedEvent } from "@domain/events/SmartFurnitureHookupDeletedEvent";

describe("SmartFurnitureHookup Entity", () => {
  describe("create()", () => {
    it("should create a smart furniture hookup and emit SmartFurnitureHookupCreatedEvent", () => {
      const id = validId();
      const name = validSmartFurnitureHookupName();
      const utilityType = validUtilityType();
      const endpoint = validEndpointUrl();

      const hookup = SmartFurnitureHookup.create(
        id,
        name,
        utilityType,
        endpoint,
      );

      expect(hookup).toBeInstanceOf(SmartFurnitureHookup);
      expect(hookup.id).toBe(id);
      expect(hookup.name).toBe(name);
      expect(hookup.utilityType).toBe(utilityType);
      expect(hookup.endpoint).toBe(endpoint);

      const events = hookup.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SmartFurnitureHookupCreatedEvent);

      expect((events[0] as SmartFurnitureHookupCreatedEvent).payload).toEqual({
        smartFurnitureHookupId: hookup.id.toString(),
        name: hookup.name.toString(),
        utilityType: hookup.utilityType.toString(),
        endpoint: hookup.endpoint.toString(),
      });
    });
  });

  describe("rehydrate()", () => {
    it("should restore a smart furniture hookup without emitting domain events", () => {
      const hookup = SmartFurnitureHookup.rehydrate(
        validId(),
        validSmartFurnitureHookupName(),
        validUtilityType(),
        validEndpointUrl(),
      );

      expect(hookup).toBeInstanceOf(SmartFurnitureHookup);
      expect(hookup.pullDomainEvents()).toHaveLength(0);
    });
  });

  describe("prepareForDeletion()", () => {
    it("should emit SmartFurnitureHookupDeletedEvent", () => {
      const hookup = SmartFurnitureHookup.create(
        validId(),
        validSmartFurnitureHookupName(),
        validUtilityType(),
        validEndpointUrl(),
      );
      hookup.pullDomainEvents();

      hookup.prepareForDeletion();

      const events = hookup.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SmartFurnitureHookupDeletedEvent);
    });
  });
});
