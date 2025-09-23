import { SmartFurnitureHookup } from "../domain/SmartFurnitureHookup";

export interface SmartFurnitureHookupDTO {
  id: string;
  name: string;
  type: string;
  consumptionUnit: string;
  endpoint: string;
}

export const smartFurnitureHookupDTOMapper = {
  toDTO(smartFurnitureHookup: SmartFurnitureHookup): SmartFurnitureHookupDTO {
    return {
      id: smartFurnitureHookup.id.value,
      name: smartFurnitureHookup.name,
      type: smartFurnitureHookup.consumption.type.toLowerCase(),
      consumptionUnit: smartFurnitureHookup.consumption.unit,
      endpoint: smartFurnitureHookup.endpoint,
    };
  },
};
