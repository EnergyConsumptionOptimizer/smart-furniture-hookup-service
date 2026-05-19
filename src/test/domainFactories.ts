import { SmartFurnitureHookupID } from "@domain/values/SmartFurnitureHookupID";
import { SmartFurnitureHookupName } from "@domain/values/SmartFurnitureHookupName";
import { UtilityType, UtilityTypeEnum } from "@domain/values/UtilityType";
import { EndpointURL } from "@domain/values/EndpointURL";
import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";

export function validId(value = "sfh-1"): SmartFurnitureHookupID {
  return SmartFurnitureHookupID.from(value) as SmartFurnitureHookupID;
}

export function validSmartFurnitureHookupName(
  value = "testName",
): SmartFurnitureHookupName {
  return SmartFurnitureHookupName.from(value) as SmartFurnitureHookupName;
}

export function validUtilityType(
  value = UtilityTypeEnum.ELECTRICITY.valueOf(),
) {
  return UtilityType.from(value) as UtilityType;
}

export function validEndpointUrl(value = "testEndpoint") {
  return EndpointURL.from(value) as EndpointURL;
}

export function aSmartFurnitureHookup(values?: {
  id?: string;
  name?: string;
  utilityType?: string;
  endpoint?: string;
}) {
  return SmartFurnitureHookup.rehydrate(
    validId(values?.id),
    validSmartFurnitureHookupName(values?.name),
    validUtilityType(values?.utilityType),
    validEndpointUrl(values?.endpoint),
  );
}
export function aNewSmartFurnitureHookup(values?: {
  id?: string;
  name?: string;
  utilityType?: string;
  endpoint?: string;
}) {
  return SmartFurnitureHookup.create(
    validId(values?.id),
    validSmartFurnitureHookupName(values?.name),
    validUtilityType(values?.utilityType),
    validEndpointUrl(values?.endpoint),
  );
}
