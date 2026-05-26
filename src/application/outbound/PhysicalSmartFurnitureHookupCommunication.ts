export interface PhysicalSmartFurnitureHookupCommunication {
  updateIngestingEndpoint(
    smartFurnitureHookupEndpoint: string,
    ingestingEndpoint: string,
  ): Promise<undefined | Error>;
}
