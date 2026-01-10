import { SmartFurnitureHookupID } from "@domain/SmartFurnitureHookupID";

export interface MonitoringService {
  registerSmartFurnitureHookup(
    id: SmartFurnitureHookupID,
    endpoint: string,
  ): Promise<void>;

  disconnectSmartFurnitureHookup(endpoint: string): Promise<void>;
}
