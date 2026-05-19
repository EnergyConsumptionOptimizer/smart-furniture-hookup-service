import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";

export interface SmartFurnitureHookupDTO {
  id: string;
  name: string;
  utilityType: string;
  endpoint: string;
}

export const smartFurnitureHookupDTOMapper = {
  toDTO(smartFurnitureHookup: SmartFurnitureHookup): SmartFurnitureHookupDTO {
    return {
      id: smartFurnitureHookup.id.toString(),
      name: smartFurnitureHookup.name.toString(),
      utilityType: smartFurnitureHookup.utilityType.toString(),
      endpoint: smartFurnitureHookup.endpoint.toString(),
    };
  },
};
