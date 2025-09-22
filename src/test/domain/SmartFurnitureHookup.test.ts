import { beforeAll, describe, expect, it } from "vitest";
import { SmartFurnitureHookupFactory } from "../../domain/SmartFurnitureHookupFactory";
import { ConsumptionType } from "../../domain/ConsumptionType";
import { ConsumptionUnit } from "../../domain/ConsumptionUnit";

describe("Smart furniture hookup domain", () => {
  describe("Smart furniture hookup Factory", () => {
    let factory: SmartFurnitureHookupFactory;

    beforeAll(() => {
      factory = new SmartFurnitureHookupFactory();
    });

    it("should create a gas type of Smart furniture hookup", () => {
      const gasSmartFurnitureHookup = factory.createSmartFurnitureHookup(
        "Smart Stove",
        ConsumptionType.GAS,
        "192.168.0.10:5001",
      );

      expect(gasSmartFurnitureHookup.consumption.type).toBe(
        ConsumptionType.GAS,
      );
      expect(gasSmartFurnitureHookup.consumption.unit).toBe(
        ConsumptionUnit.CUBIC_METER,
      );
    });

    it("should create a water type of Smart furniture hookup", () => {
      const gasSmartFurnitureHookup = factory.createSmartFurnitureHookup(
        "Smart Sink",
        ConsumptionType.WATER,
        "192.168.0.10:5001",
      );

      expect(gasSmartFurnitureHookup.consumption.type).toBe(
        ConsumptionType.WATER,
      );
      expect(gasSmartFurnitureHookup.consumption.unit).toBe(
        ConsumptionUnit.LITER,
      );
    });

    it("should create a electric type of Smart furniture hookup", () => {
      const gasSmartFurnitureHookup = factory.createSmartFurnitureHookup(
        "Smart Lamp",
        ConsumptionType.ELECTRICITY,
        "192.168.0.10:5001",
      );

      expect(gasSmartFurnitureHookup.consumption.type).toBe(
        ConsumptionType.ELECTRICITY,
      );
      expect(gasSmartFurnitureHookup.consumption.unit).toBe(
        ConsumptionUnit.KILOWATT_HOUR,
      );
    });
  });
});
