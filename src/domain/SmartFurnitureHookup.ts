import { Consumption } from "./Consumption";
import { SmartFurnitureHookupID } from "./SmartFurnitureHookupID";

export interface SmartFurnitureHookup {
  id: SmartFurnitureHookupID;
  name: string;
  consumption: Consumption;
  endpoint: string;
}
