import { SmartFurnitureHookupID } from "./SmartFurnitureHookupID";
import { UtilityType } from "./UtilityType";

export interface SmartFurnitureHookup {
  id: SmartFurnitureHookupID;
  name: string;
  utilityType: UtilityType;
  endpoint: string;
}
