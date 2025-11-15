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

export class InvalidUtilityTypeError extends Error {
  constructor(type: string) {
    super(`Invalid utility type: ${type}`);
    this.name = "InvalidUtilityTypeError";
  }
}
