import { BaseDomainEvent } from "@domain/events/BaseDomainEvent";
import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";
import { SmartFurnitureHookupName } from "@domain/values/SmartFurnitureHookupName";

interface SmartFurnitureHookupRenamePayload extends Record<string, unknown> {
  readonly smartFurnitureHookupId: string;
  readonly oldName: string;
  readonly newName: string;
}

export class SmartFurnitureHookupRenamedEvent extends BaseDomainEvent<SmartFurnitureHookupRenamePayload> {
  readonly eventType = "SmartFurnitureHookupRenamedEvent";
  readonly aggregateType = "SmartFurnitureHookup";
  readonly payload: SmartFurnitureHookupRenamePayload;

  constructor(
    smartFurnitureHookup: SmartFurnitureHookup,
    oldName: SmartFurnitureHookupName,
  ) {
    super(smartFurnitureHookup.id.toString());

    const smartFurnitureHookupDTO = smartFurnitureHookup.toString();

    this.payload = {
      smartFurnitureHookupId: smartFurnitureHookupDTO.id,
      oldName: oldName.toString(),
      newName: smartFurnitureHookupDTO.name,
    };
  }
}
