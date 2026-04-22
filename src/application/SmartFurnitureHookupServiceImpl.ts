import { SmartFurnitureHookup } from "@domain/SmartFurnitureHookup";
import { utilityTypeFromString } from "@domain/UtilityType";
import { SmartFurnitureHookupFactory } from "@domain/SmartFurnitureHookupFactory";
import { SmartFurnitureHookupID } from "@domain/SmartFurnitureHookupID";

import { SmartFurnitureHookupEndpointConfigurationError } from "@application/errors";
import { SmartFurnitureHookupService } from "@application/inbound/SmartFurnitureHookupService";
import { SmartFurnitureHookupRepository } from "@application/outbound/SmartFurnitureHookupRepository";
import { MonitoringService } from "@application/outbound/MonitoringService";
import { SmartFurnitureHookupNotFoundError } from "@domain/errors";

export class SmartFurnitureHookupServiceImpl implements SmartFurnitureHookupService {
  constructor(
    private readonly smartFurnitureHookupRepository: SmartFurnitureHookupRepository,
    private readonly monitoringService: MonitoringService,
  ) {}

  async createSmartFurnitureHookup(
    name: string,
    type: string,
    endpoint: string,
  ): Promise<SmartFurnitureHookup> {
    const smartFurnitureHookup =
      await this.smartFurnitureHookupRepository.saveSmartFurnitureHookup(
        new SmartFurnitureHookupFactory().createSmartFurnitureHookup(
          name,
          utilityTypeFromString(type),
          endpoint,
        ),
      );

    try {
      await this.monitoringService.registerSmartFurnitureHookup(
        smartFurnitureHookup.id,
        smartFurnitureHookup.endpoint,
      );
    } catch {
      await this.smartFurnitureHookupRepository.removeSmartFurnitureHookup(
        smartFurnitureHookup.id,
      );

      throw new SmartFurnitureHookupEndpointConfigurationError(
        smartFurnitureHookup.endpoint,
      );
    }

    return smartFurnitureHookup;
  }

  async deleteSmartFurnitureHookup(id: SmartFurnitureHookupID): Promise<void> {
    const currentSmartFurnitureHookup =
      await this.checkIfSmartFurnitureHookupExists(id);

    await this.monitoringService
      .disconnectSmartFurnitureHookup(currentSmartFurnitureHookup.endpoint)
      .catch();

    return this.smartFurnitureHookupRepository.removeSmartFurnitureHookup(id);
  }

  async getSmartFurnitureHookups(): Promise<SmartFurnitureHookup[]> {
    return this.smartFurnitureHookupRepository.findAllSmartFurnitureHookup();
  }

  async getSmartFurnitureHookup(
    id: SmartFurnitureHookupID,
  ): Promise<SmartFurnitureHookup | null> {
    return this.smartFurnitureHookupRepository.findSmartFurnitureHookupByID(id);
  }

  async updateSmartFurnitureHookup(
    id: SmartFurnitureHookupID,
    name?: string,
    endpoint?: string,
  ): Promise<SmartFurnitureHookup> {
    const currentSmartFurnitureHookup =
      await this.checkIfSmartFurnitureHookupExists(id);

    if (endpoint) {
      try {
        await this.monitoringService.registerSmartFurnitureHookup(id, endpoint);
      } catch {
        throw new SmartFurnitureHookupEndpointConfigurationError(endpoint);
      }
    }

    const smartFurnitureHookupToUpdate: SmartFurnitureHookup = {
      ...currentSmartFurnitureHookup,
      name: name ?? currentSmartFurnitureHookup.name,
      endpoint: endpoint ?? currentSmartFurnitureHookup.endpoint,
    };

    return this.smartFurnitureHookupRepository.updateSmartFurnitureHookup(
      smartFurnitureHookupToUpdate,
    );
  }

  private async checkIfSmartFurnitureHookupExists(id: SmartFurnitureHookupID) {
    const currentSmartFurnitureHookup =
      await this.smartFurnitureHookupRepository.findSmartFurnitureHookupByID(
        id,
      );

    if (!currentSmartFurnitureHookup) {
      throw new SmartFurnitureHookupNotFoundError();
    } else return currentSmartFurnitureHookup;
  }
}
