import { InvalidConsumptionUnitError } from "./errors/errors";

export enum ConsumptionUnit {
  CUBIC_METER = "m³",
  LITER = "L",
  KILOWATT_HOUR = "kWh",
}

export function consumptionUnitFromString(value: string): ConsumptionUnit {
  const consumptionUnit = Object.values(ConsumptionUnit).find(
    (unit) => unit.toLowerCase() === value.toLowerCase(),
  );

  if (!consumptionUnit) {
    throw new InvalidConsumptionUnitError(value);
  }

  return consumptionUnit;
}
