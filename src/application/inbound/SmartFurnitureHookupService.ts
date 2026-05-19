import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";

/**
 * Service interface for managing smart furniture hookup.
 */
export interface SmartFurnitureHookupService {
  /**
   * Retrieves all smart furniture hookups.
   *
   * @returns A promise that resolves to an array of smart furniture hookups.
   */
  getSmartFurnitureHookups(): Promise<SmartFurnitureHookup[]>;

  /**
   * Retrieves a single smart furniture hookup by their unique identifier.
   *
   * @param id - The unique identifier of the smart furniture hookup.
   * @returns A promise that resolves to the smart furniture hookup if found, or `null` otherwise.
   *
   * @throws InvalidIDError
   */
  getSmartFurnitureHookup(id: string): Promise<SmartFurnitureHookup | Error>;

  /**
   * Creates a new smart furniture hookup with the given name, consumption and endpoint.
   *
   * @param name - The name of the new smart furniture hookup.
   * @param utilityType - The consumption information of the new smart furniture hookup.
   * @param endpoint - The endpoint of the new smart furniture hookup.
   */
  createSmartFurnitureHookup(
    name: string,
    utilityType: string,
    endpoint: string,
  ): Promise<SmartFurnitureHookup | Error>;

  /**
   * Updates the name and/or the endpoint of a smart furniture hookup.
   *
   * @param id - The unique identifier of the smart furniture hookup.
   * @param name - The new name to set.
   * @param endpoint - The new endpoint to set.
   *
   * @throws InvalidIDError
   * @throws SmartFurnitureHookupNotFoundError
   * @throws SmartFurnitureHookupNameConflictError
   * @throws SmartFurnitureHookupEndpointConflictError
   */
  updateSmartFurnitureHookup(
    id: string,
    name?: string,
    endpoint?: string,
  ): Promise<SmartFurnitureHookup | Error>;

  /**
   *  Deletes an existing smart furniture hookup by their unique identifier.
   *
   * @param id - The unique identifier of the smart furniture hookup.
   *
   * @throws InvalidIDError
   * @throws SmartFurnitureHookupNotFoundError
   */
  deleteSmartFurnitureHookup(id: string): Promise<undefined | Error>;
}
