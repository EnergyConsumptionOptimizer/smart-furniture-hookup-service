import { SmartFurnitureHookupID } from "../SmartFurnitureHookupID";
import { SmartFurnitureHookup } from "../SmartFurnitureHookup";

/**
 * Repository interface for managing and retrieving smart furniture hookup entities.
 */
export interface SmartFurnitureHookupRepository {
  /**
   * Retrieves all smart furniture hookups.
   *
   * @returns A promise that resolves to an array of smart furniture hookup.
   */
  findAllSmartFurnitureHookup(): Promise<SmartFurnitureHookup[]>;

  /**
   * Finds a smart furniture hookup by its unique identifier.
   *
   * @param id - The unique smart furniture hookup identifier.
   * @returns A Promise that resolves to the SmartFurnitureHookup if found,
   *          or `null`  if no smart furniture hookup exists with the given ID.
   *
   * @throws InvalidIDError
   */
  findSmartFurnitureHookupByID(
    id: SmartFurnitureHookupID,
  ): Promise<SmartFurnitureHookup | null>;

  /**
   * Adds a new smart furniture hookup.
   *
   * @param smartFurnitureHookup - The smart furniture hookup entity to add.
   * @returns A Promise that resolves to the created smart furniture hookup.
   *
   * @throws SmartFurnitureHookupNameConflictError
   * @throws SmartFurnitureHookupEndpointConflictError
   */
  saveSmartFurnitureHookup(
    smartFurnitureHookup: SmartFurnitureHookup,
  ): Promise<SmartFurnitureHookup>;

  /**
   * Updates the details of a smart furniture hookup.
   *
   * @param smartFurnitureHookup - The smart furniture hookup with updated information.
   * @returns A Promise that resolves to the updated smart furniture hookup.
   *
   * @throws SmartFurnitureHookupNameConflictError
   * @throws SmartFurnitureHookupEndpointConflictError
   */
  updateSmartFurnitureHookup(
    smartFurnitureHookup: SmartFurnitureHookup,
  ): Promise<SmartFurnitureHookup>;

  /**
   * Removes a smart furniture hookup from the repository.
   *
   * @param id – The unique identifier of the smart furniture hookup to remove.
   * @returns A Promise that resolves once the smart furniture hookup has been removed.
   *
   * @throws InvalidIDError
   * @throws SmartFurnitureHookupNotFoundError
   */
  removeSmartFurnitureHookup(id: SmartFurnitureHookupID): Promise<void>;
}
