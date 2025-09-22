import { beforeAll, describe, expect, it } from "vitest";
import { SmartFurnitureHookupFactory } from "../../domain/SmartFurnitureHookupFactory";
import {
  InvalidConsumptionTypeError,
  InvalidConsumptionUnitError,
} from "../../domain/errors/errors";
import {
  ConsumptionType,
  consumptionTypeFromString,
} from "../../domain/ConsumptionType";
import {
  ConsumptionUnit,
  consumptionUnitFromString,
} from "../../domain/ConsumptionUnit";

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
  describe("consumptionTypeFromString", () => {
    it("should let resolve GAS type", () => {
      const gasType = consumptionTypeFromString("gas");

      expect(gasType).toBe(ConsumptionType.GAS);
    });
    it("should let resolve WATER type", () => {
      const waterType = consumptionTypeFromString("water");

      expect(waterType).toBe(ConsumptionType.WATER);
    });
    it("should let resolve ELECTRICITY type", () => {
      const electricityType = consumptionTypeFromString("electricity");

      expect(electricityType).toBe(ConsumptionType.ELECTRICITY);
    });
    it("should throw error when the type doesnt exist", () => {
      expect(() => consumptionTypeFromString("energy")).toThrowError(
        InvalidConsumptionTypeError,
      );
    });
  });
  describe("consumptionUnitFromString", () => {
    it("should let resolve CUBIC_METER unit given his value", () => {
      const cubitMeterUnit = consumptionUnitFromString("m³");

      expect(cubitMeterUnit).toBe(ConsumptionUnit.CUBIC_METER);
    });
    it("should let resolve LITER unit given his value", () => {
      const literUnit = consumptionUnitFromString("L");

      expect(literUnit).toBe(ConsumptionUnit.LITER);
    });
    it("should let resolve KILOWATT_HOUR unit given his value", () => {
      const kilowattHourUnit = consumptionUnitFromString("kWh");

      expect(kilowattHourUnit).toBe(ConsumptionUnit.KILOWATT_HOUR);
    });

    it("should throw error when the unit doesnt exist", () => {
      expect(() => consumptionUnitFromString("mL")).toThrowError(
        InvalidConsumptionUnitError,
      );
    });
  });
});
