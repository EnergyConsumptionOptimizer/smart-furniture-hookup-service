import { SmartFurnitureHookupRepository } from "@domain/ports/SmartFurnitureHookupRepository";
import { SmartFurnitureHookup } from "@domain/SmartFurnitureHookup";
import { SmartFurnitureHookupID } from "@domain/SmartFurnitureHookupID";
import { v4 as uuidv4, validate } from "uuid";
import {
  InvalidIDError,
  SmartFurnitureHookupEndpointConflictError,
  SmartFurnitureHookupNameConflictError,
  SmartFurnitureHookupNotFoundError,
} from "@domain/errors/errors";

export class InMemorySmartFurnitureHookupRepository
  implements SmartFurnitureHookupRepository
{
  private smartFurnitureHookup: SmartFurnitureHookup[] = [];

  private checkForConflicts(smartFurnitureHookup: SmartFurnitureHookup) {
    const existingSmartFurnitureHookup = this.smartFurnitureHookup.find(
      (sfh) =>
        (sfh.name === smartFurnitureHookup.name ||
          sfh.endpoint === smartFurnitureHookup.endpoint) &&
        sfh.id.value !== smartFurnitureHookup.id.value,
    );

    if (!existingSmartFurnitureHookup) return;

    if (
      existingSmartFurnitureHookup &&
      existingSmartFurnitureHookup.name === smartFurnitureHookup.name
    ) {
      throw new SmartFurnitureHookupNameConflictError(
        smartFurnitureHookup.name,
      );
    }

    if (
      existingSmartFurnitureHookup &&
      existingSmartFurnitureHookup.endpoint === smartFurnitureHookup.endpoint
    ) {
      throw new SmartFurnitureHookupEndpointConflictError(
        smartFurnitureHookup.endpoint,
      );
    }
  }

  async saveSmartFurnitureHookup(
    smartFurnitureHookup: SmartFurnitureHookup,
  ): Promise<SmartFurnitureHookup> {
    this.checkForConflicts(smartFurnitureHookup);

    const newSmartFurnitureHookup: SmartFurnitureHookup = {
      ...smartFurnitureHookup,
      id: { value: uuidv4() },
    };

    this.smartFurnitureHookup.push(newSmartFurnitureHookup);

    return newSmartFurnitureHookup;
  }

  async findSmartFurnitureHookupByID(
    id: SmartFurnitureHookupID,
  ): Promise<SmartFurnitureHookup | null> {
    this.validateSmartFurnitureHookupID(id);

    const smartFurnitureHookup = this.smartFurnitureHookup.find(
      (sfh) => sfh.id.value === id.value,
    );

    return smartFurnitureHookup ? smartFurnitureHookup : null;
  }

  async findAllSmartFurnitureHookup() {
    return this.smartFurnitureHookup;
  }

  async updateSmartFurnitureHookup(
    smartFurnitureHookup: SmartFurnitureHookup,
  ): Promise<SmartFurnitureHookup> {
    this.validateSmartFurnitureHookupID(smartFurnitureHookup.id);

    const smartFurnitureHookupIndex = this.smartFurnitureHookup.findIndex(
      (sfh) => sfh.id.value === smartFurnitureHookup.id.value,
    );

    if (smartFurnitureHookupIndex === -1) {
      throw new SmartFurnitureHookupNotFoundError();
    }

    this.checkForConflicts(smartFurnitureHookup);

    const updatedSmartFurnitureHookup = {
      ...this.smartFurnitureHookup[smartFurnitureHookupIndex],
      name: smartFurnitureHookup.name,
      endpoint: smartFurnitureHookup.endpoint,
    };

    this.smartFurnitureHookup[smartFurnitureHookupIndex] =
      updatedSmartFurnitureHookup;

    return updatedSmartFurnitureHookup;
  }

  async removeSmartFurnitureHookup(id: SmartFurnitureHookupID): Promise<void> {
    this.validateSmartFurnitureHookupID(id);

    const smartFurnitureHookupIndex = this.smartFurnitureHookup.findIndex(
      (sfh) => sfh.id.value === id.value,
    );

    if (smartFurnitureHookupIndex === -1) {
      throw new SmartFurnitureHookupNotFoundError();
    }

    this.smartFurnitureHookup.splice(smartFurnitureHookupIndex, 1);
  }

  private validateSmartFurnitureHookupID(value: SmartFurnitureHookupID) {
    if (!validate(value.value)) {
      throw new InvalidIDError();
    }
  }

  clear() {
    this.smartFurnitureHookup = [];
  }

  length() {
    return this.smartFurnitureHookup.length;
  }
}
