export class SmartFurnitureHookupNameConflictError extends Error {
  constructor(name: string) {
    super(`Name ${name} already exists`);
    this.name = "SmartFurnitureHookupNameConflictError";
  }
}

export class SmartFurnitureHookupEndpointConflictError extends Error {
  constructor(endpoint: string) {
    super(`Endpoint ${endpoint} already exists`);
    this.name = "SmartFurnitureHookupEndpointConflictError";
  }
}

export class SmartFurnitureHookupNotFoundError extends Error {
  constructor() {
    super("Smart furniture hookup not found");
    this.name = "SmartFurnitureHookupNotFoundError";
  }
}

export class InvalidIDError extends Error {
  constructor() {
    super("Invalid smart furniture hookup ID format");
    this.name = "InvalidIDError";
  }
}

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
