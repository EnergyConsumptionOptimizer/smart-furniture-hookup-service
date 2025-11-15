import { SmartFurnitureHookup } from "./SmartFurnitureHookup";
import { UtilityType } from "./UtilityType";

export class SmartFurnitureHookupFactory {
  createSmartFurnitureHookup(
    name: string,
    utilityType: UtilityType,
    endpoint: string,
  ): SmartFurnitureHookup {
    return {
      id: { value: "" },
      name,
      utilityType,
      endpoint,
    };
  }
}
