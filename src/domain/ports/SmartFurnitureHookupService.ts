import { SmartFurnitureHookup } from "../SmartFurnitureHookup";
import { SmartFurnitureHookupID } from "../SmartFurnitureHookupID";

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
  getSmartFurnitureHookup(
    id: SmartFurnitureHookupID,
  ): Promise<SmartFurnitureHookup | null>;

  /**
   * Creates a new smart furniture hookup with the given name, consumption and endpoint.
   *
   * @param name - The name of the new smart furniture hookup.
   * @param consumption - The consumption information of the new smart furniture hookup.
   * @param endpoint - The endpoint of the new smart furniture hookup.
   *
   * @throws SmartFurnitureHookupNameConflictError
   * @throws SmartFurnitureHookupEndpointConflictError
   * @throws InvalidConsumptionTypeError
   */
  createSmartFurnitureHookup(
    name: string,
    consumption: string,
    endpoint: string,
  ): Promise<SmartFurnitureHookup>;

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
    id: SmartFurnitureHookupID,
    name?: string,
    endpoint?: string,
  ): Promise<SmartFurnitureHookup>;

  /**
   *  Deletes an existing smart furniture hookup by their unique identifier.
   *
   * @param id - The unique identifier of the smart furniture hookup.
   *
   * @throws InvalidIDError
   * @throws SmartFurnitureHookupNotFoundError
   */
  deleteSmartFurnitureHookup(id: SmartFurnitureHookupID): Promise<void>;
}
