import { ConsumptionType } from "../../domain/ConsumptionType";
import { SmartFurnitureHookupFactory } from "../../domain/SmartFurnitureHookupFactory";

const hookupFactory = new SmartFurnitureHookupFactory();

export const mockSmartFurnitureHookupBathroomSink =
  hookupFactory.createSmartFurnitureHookup(
    "Smart Bathroom Sink",
    ConsumptionType.WATER,
    "192.168.0.10:5001",
  );

export const mockSmartFurnitureHookupKitchenSink =
  hookupFactory.createSmartFurnitureHookup(
    "Smart Kitchen Sink",
    ConsumptionType.WATER,
    "192.168.0.10:5002",
  );

export const mockSmartFurnitureHookupStove =
  hookupFactory.createSmartFurnitureHookup(
    "Smart Stove",
    ConsumptionType.GAS,
    "192.168.0.10:5003",
  );

export const mockSmartFurnitureHookupHeater =
  hookupFactory.createSmartFurnitureHookup(
    "Smart Heater",
    ConsumptionType.GAS,
    "192.168.0.10:5004",
  );

export const mockSmartFurnitureHookupLamp =
  hookupFactory.createSmartFurnitureHookup(
    "Smart Lamp",
    ConsumptionType.ELECTRICITY,
    "192.168.0.10:5005",
  );

export const mockSmartFurnitureHookupFridge =
  hookupFactory.createSmartFurnitureHookup(
    "Smart Fridge",
    ConsumptionType.ELECTRICITY,
    "192.168.0.10:5006",
  );
