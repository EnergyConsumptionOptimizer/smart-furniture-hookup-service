import { ConsumptionType } from "./ConsumptionType";
import { SmartFurnitureHookup } from "./SmartFurnitureHookup";
import { Consumption } from "./Consumption";
import { ConsumptionUnit } from "./ConsumptionUnit";

export class SmartFurnitureHookupFactory {
  private consumptionTypeToUnit: Record<ConsumptionType, ConsumptionUnit> = {
    [ConsumptionType.WATER]: ConsumptionUnit.LITER,
    [ConsumptionType.GAS]: ConsumptionUnit.CUBIC_METER,
    [ConsumptionType.ELECTRICITY]: ConsumptionUnit.KILOWATT_HOUR,
  };

  private createConsumption(type: ConsumptionType): Consumption {
    return {
      type,
      unit: this.consumptionTypeToUnit[type],
    };
  }

  createSmartFurnitureHookup(
    name: string,
    consumptionType: ConsumptionType,
    endpoint: string,
  ): SmartFurnitureHookup {
    return {
      id: { value: "" },
      name,
      consumption: this.createConsumption(consumptionType),
      endpoint,
    };
  }
}
