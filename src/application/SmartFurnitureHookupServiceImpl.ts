import { SmartFurnitureHookupService } from "../domain/ports/SmartFurnitureHookupService";
import { consumptionTypeFromString } from "../domain/ConsumptionType";
import { SmartFurnitureHookup } from "../domain/SmartFurnitureHookup";
import { SmartFurnitureHookupID } from "../domain/SmartFurnitureHookupID";
import { SmartFurnitureHookupRepository } from "../domain/ports/SmartFurnitureHookupRepository";
import { SmartFurnitureHookupFactory } from "../domain/SmartFurnitureHookupFactory";
import { SmartFurnitureHookupNotFoundError } from "../domain/errors/errors";

export class SmartFurnitureHookupServiceImpl
  implements SmartFurnitureHookupService
{
  constructor(
    private readonly smartFurnitureHookupRepository: SmartFurnitureHookupRepository,
  ) {}

  async createSmartFurnitureHookup(
    name: string,
    type: string,
    endpoint: string,
  ): Promise<SmartFurnitureHookup> {
    const consumptionType = consumptionTypeFromString(type);

    return this.smartFurnitureHookupRepository.addSmartFurnitureHookup(
      new SmartFurnitureHookupFactory().createSmartFurnitureHookup(
        name,
        consumptionType,
        endpoint,
      ),
    );
  }

  async deleteSmartFurnitureHookup(id: SmartFurnitureHookupID): Promise<void> {
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
      await this.smartFurnitureHookupRepository.findSmartFurnitureHookupByID(
        id,
      );

    if (!currentSmartFurnitureHookup) {
      throw new SmartFurnitureHookupNotFoundError();
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
}
