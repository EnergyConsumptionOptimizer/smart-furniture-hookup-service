import { SmartFurnitureHookupModel } from "@infrastructure/mongo/mongoose/SmartFurnitureHookupModel";
import { UtilityTypeEnum } from "@domain/values/UtilityType";

export async function seedSmartFurnitureHookup(
  id: string,
  name: string,
  endpoint: string,
): Promise<void> {
  await SmartFurnitureHookupModel.create({
    _id: id,
    name: name,
    utilityType: UtilityTypeEnum.ELECTRICITY,
    endpoint: endpoint,
  });
}
