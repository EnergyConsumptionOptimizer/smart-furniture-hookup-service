import { BaseDomainEvent } from "@domain/events/BaseDomainEvent";
import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";
import { EndpointURL } from "@domain/values/EndpointURL";

interface SmartFurnitureHookupEndpointChangePayload extends Record<
  string,
  unknown
> {
  readonly smartFurnitureHookupId: string;
  readonly name: string;
  readonly oldEndpoint: string;
  readonly newEndpoint: string;
}

export class SmartFurnitureHookupEndpointChangedEvent extends BaseDomainEvent<SmartFurnitureHookupEndpointChangePayload> {
  readonly eventType = "SmartFurnitureHookupEndpointChangedEvent";
  readonly aggregateType = "SmartFurnitureHookup";
  readonly payload: SmartFurnitureHookupEndpointChangePayload;

  constructor(
    smartFurnitureHookup: SmartFurnitureHookup,
    oldEndpoint: EndpointURL,
  ) {
    super(smartFurnitureHookup.id.toString());

    const smartFurnitureHookupDTO = smartFurnitureHookup.toString();

    this.payload = {
      smartFurnitureHookupId: smartFurnitureHookupDTO.id,
      name: smartFurnitureHookupDTO.name,
      oldEndpoint: oldEndpoint.toString(),
      newEndpoint: smartFurnitureHookupDTO.endpoint,
    };
  }
}
