import { InvalidConsumptionTypeError } from "./errors/errors";

export enum ConsumptionType {
  GAS = "GAS",
  WATER = "WATER",
  ELECTRICITY = "ELECTRICITY",
}

export function consumptionTypeFromString(value: string): ConsumptionType {
  const consumptionType =
    ConsumptionType[value.toUpperCase() as keyof typeof ConsumptionType];

  if (!consumptionType) {
    throw new InvalidConsumptionTypeError(value);
  }

  return consumptionType;
}
