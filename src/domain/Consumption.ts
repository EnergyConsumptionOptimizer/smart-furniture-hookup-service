import { ConsumptionType } from "./ConsumptionType";
import { ConsumptionUnit } from "./ConsumptionUnit";

export interface Consumption {
  type: ConsumptionType;
  unit: ConsumptionUnit;
}
