import { BaseDomainEvent } from "@domain/events/BaseDomainEvent";
import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";

interface SmartFurnitureHookupCreatePayload extends Record<string, unknown> {
  readonly smartFurnitureHookupId: string;
  readonly name: string;
  readonly utilityType: string;
  readonly endpoint: string;
}

export class SmartFurnitureHookupCreatedEvent extends BaseDomainEvent<SmartFurnitureHookupCreatePayload> {
  readonly eventType = "SmartFurnitureHookupCreatedEvent";
  readonly aggregateType = "SmartFurnitureHookup";
  readonly payload: SmartFurnitureHookupCreatePayload;

  constructor(smartFurnitureHookup: SmartFurnitureHookup) {
    super(smartFurnitureHookup.id.toString());

    const smartFurnitureHookupDTO = smartFurnitureHookup.toString();

    this.payload = {
      smartFurnitureHookupId: smartFurnitureHookupDTO.id,
      name: smartFurnitureHookupDTO.name,
      utilityType: smartFurnitureHookupDTO.utilityType,
      endpoint: smartFurnitureHookupDTO.endpoint,
    };
  }
}
