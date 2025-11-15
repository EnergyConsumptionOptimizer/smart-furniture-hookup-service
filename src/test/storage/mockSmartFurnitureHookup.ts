import { UtilityType } from "@domain/UtilityType";
import { SmartFurnitureHookupFactory } from "@domain/SmartFurnitureHookupFactory";

const hookupFactory = new SmartFurnitureHookupFactory();

export const mockSmartFurnitureHookupBathroomSink =
  hookupFactory.createSmartFurnitureHookup(
    "Smart Bathroom Sink",
    UtilityType.WATER,
    "192.168.0.10:5001",
  );

export const mockSmartFurnitureHookupKitchenSink =
  hookupFactory.createSmartFurnitureHookup(
    "Smart Kitchen Sink",
    UtilityType.WATER,
    "192.168.0.10:5002",
  );

export const mockSmartFurnitureHookupStove =
  hookupFactory.createSmartFurnitureHookup(
    "Smart Stove",
    UtilityType.GAS,
    "192.168.0.10:5003",
  );

export const mockSmartFurnitureHookupHeater =
  hookupFactory.createSmartFurnitureHookup(
    "Smart Heater",
    UtilityType.GAS,
    "192.168.0.10:5004",
  );

export const mockSmartFurnitureHookupLamp =
  hookupFactory.createSmartFurnitureHookup(
    "Smart Lamp",
    UtilityType.ELECTRICITY,
    "192.168.0.10:5005",
  );

export const mockSmartFurnitureHookupFridge =
  hookupFactory.createSmartFurnitureHookup(
    "Smart Fridge",
    UtilityType.ELECTRICITY,
    "192.168.0.10:5006",
  );
