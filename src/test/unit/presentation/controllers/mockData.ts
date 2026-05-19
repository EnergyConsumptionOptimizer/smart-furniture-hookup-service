import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";
import { SmartFurnitureHookupID } from "@domain/values/SmartFurnitureHookupID";
import { SmartFurnitureHookupName } from "@domain/values/SmartFurnitureHookupName";
import { UtilityType } from "@domain/values/UtilityType";
import { EndpointURL } from "@domain/values/EndpointURL";

function toDomain(
  id: string,
  name: string,
  utilityType: string,
  endpoint: string,
) {
  return SmartFurnitureHookup.rehydrate(
    SmartFurnitureHookupID.from(id) as SmartFurnitureHookupID,
    SmartFurnitureHookupName.from(name) as SmartFurnitureHookupName,
    UtilityType.from(utilityType) as UtilityType,
    EndpointURL.from(endpoint) as EndpointURL,
  );
}

export const mockSmartFurnitureHookupBathroomSink = toDomain(
  "sfh-1",
  "Smart Bathroom Sink",
  "WATER",
  "192.168.0.10:5001",
);

export const mockSmartFurnitureHookupKitchenSink = toDomain(
  "sfh-2",
  "Smart Kitchen Sink",
  "WATER",
  "192.168.0.10:5002",
);

export const mockSmartFurnitureHookupStove = toDomain(
  "sfh-3",
  "Smart Stove",
  "GAS",
  "192.168.0.10:5003",
);

export const mockSmartFurnitureHookupHeater = toDomain(
  "sfh-4",
  "Smart Heater",
  "GAS",
  "192.168.0.10:5004",
);

export const mockSmartFurnitureHookupLamp = toDomain(
  "sfh-5",
  "Smart Lamp",
  "ELECTRICITY",
  "192.168.0.10:5005",
);

export const mockSmartFurnitureHookupFridge = toDomain(
  "sfh-6",
  "Smart Fridge",
  "ELECTRICITY",
  "192.168.0.10:5006",
);
