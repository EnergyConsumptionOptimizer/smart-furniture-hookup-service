export class InvalidConsumptionTypeError extends Error {
  constructor(type: string) {
    super(`Invalid consumption type: ${type}`);
    this.name = "InvalidConsumptionTypeError";
  }
}

export class InvalidConsumptionUnitError extends Error {
  constructor(unit: string) {
    super(`Invalid consumption unit: ${unit}`);
    this.name = "InvalidConsumptionUnitError";
  }
}
