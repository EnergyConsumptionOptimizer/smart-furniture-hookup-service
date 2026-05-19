import { BaseDomainEvent } from "@domain/events/BaseDomainEvent";
import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";

interface SmartFurnitureHookupDeletePayload extends Record<string, unknown> {
  readonly smartFurnitureHookupId: string;
  readonly name: string;
}

export class SmartFurnitureHookupDeletedEvent extends BaseDomainEvent<SmartFurnitureHookupDeletePayload> {
  readonly eventType = "SmartFurnitureHookupDeletedEvent";
  readonly aggregateType = "SmartFurnitureHookup";
  readonly payload: SmartFurnitureHookupDeletePayload;

  constructor(smartFurnitureHookup: SmartFurnitureHookup) {
    super(smartFurnitureHookup.id.toString());

    const smartFurnitureHookupDTO = smartFurnitureHookup.toString();

    this.payload = {
      smartFurnitureHookupId: smartFurnitureHookupDTO.id,
      name: smartFurnitureHookupDTO.name,
    };
  }
}
