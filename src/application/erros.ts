export class SmartFurnitureHookupEndpointConfigurationError extends Error {
  constructor(endpoint: string) {
    super(`Could not configure endpoint: ${endpoint}`);
    this.name = "SmartFurnitureHookupEndpointConfigurationError";
  }
}
