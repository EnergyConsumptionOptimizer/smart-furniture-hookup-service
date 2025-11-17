import { SmartFurnitureHookup } from "@domain/SmartFurnitureHookup";

export interface SmartFurnitureHookupDTO {
  id: string;
  name: string;
  utilityType: string;
  endpoint: string;
}

export const smartFurnitureHookupDTOMapper = {
  toDTO(smartFurnitureHookup: SmartFurnitureHookup): SmartFurnitureHookupDTO {
    return {
      id: smartFurnitureHookup.id.value,
      name: smartFurnitureHookup.name,
      utilityType: smartFurnitureHookup.utilityType,
      endpoint: smartFurnitureHookup.endpoint,
    };
  },
};
