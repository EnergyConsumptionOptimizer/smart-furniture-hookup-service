import { SmartFurnitureHookupID } from "@domain/SmartFurnitureHookupID";

/**
 * @outbound
 * Service interface for managing monitoring connections
 * to smart furniture hookups.
 */
export interface MonitoringService {
  /**
   * Registers a smart furniture hookup with a monitoring endpoint.
   *
   * @param id - Unique identifier of the smart furniture hookup
   * @param endpoint - The endpoint URL or address used for monitoring
   * @returns A promise that resolves when the hookup is successfully registered
   */
  registerSmartFurnitureHookup(
    id: SmartFurnitureHookupID,
    endpoint: string,
  ): Promise<void>;

  /**
   * Disconnects a previously registered smart furniture hookup
   * from its monitoring endpoint.
   *
   * @param endpoint - The endpoint URL or address to disconnect
   * @returns A promise that resolves when the hookup is successfully disconnected
   */
  disconnectSmartFurnitureHookup(endpoint: string): Promise<void>;
}
