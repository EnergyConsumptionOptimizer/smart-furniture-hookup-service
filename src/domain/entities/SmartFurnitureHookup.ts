import { SmartFurnitureHookupID } from "@domain/values/SmartFurnitureHookupID";
import { UtilityType } from "@domain/values/UtilityType";
import { AggregateRoot } from "@domain/entities/AggregateRoot";
import { EndpointURL } from "@domain/values/EndpointURL";
import { SmartFurnitureHookupName } from "@domain/values/SmartFurnitureHookupName";
import { SmartFurnitureHookupCreatedEvent } from "@domain/events/SmartFurnitureHookupCreatedEvent";
import { SmartFurnitureHookupDeletedEvent } from "@domain/events/SmartFurnitureHookupDeletedEvent";
import { SmartFurnitureHookupEndpointChangedEvent } from "@domain/events/SmartFurnitureHookupEndpointChangedEvent";
import { SmartFurnitureHookupRenamedEvent } from "@domain/events/SmartFurnitureHookupRenamedEvent";

export class SmartFurnitureHookup extends AggregateRoot {
  #name: SmartFurnitureHookupName;
  readonly #utilityType: UtilityType;
  #endpoint: EndpointURL;

  private constructor(
    public readonly id: SmartFurnitureHookupID,
    name: SmartFurnitureHookupName,
    utilityType: UtilityType,
    endpoint: EndpointURL,
  ) {
    super();
    this.#name = name;
    this.#utilityType = utilityType;
    this.#endpoint = endpoint;
  }

  get name(): SmartFurnitureHookupName {
    return this.#name;
  }

  get utilityType(): UtilityType {
    return this.#utilityType;
  }

  get endpoint(): EndpointURL {
    return this.#endpoint;
  }

  static create(
    id: SmartFurnitureHookupID,
    name: SmartFurnitureHookupName,
    utilityType: UtilityType,
    endpoint: EndpointURL,
  ): SmartFurnitureHookup {
    const smartFurnitureHookup = new SmartFurnitureHookup(
      id,
      name,
      utilityType,
      endpoint,
    );
    smartFurnitureHookup.addDomainEvent(
      new SmartFurnitureHookupCreatedEvent(smartFurnitureHookup),
    );

    return smartFurnitureHookup;
  }

  static rehydrate(
    id: SmartFurnitureHookupID,
    name: SmartFurnitureHookupName,
    utilityType: UtilityType,
    endpoint: EndpointURL,
  ): SmartFurnitureHookup {
    return new SmartFurnitureHookup(id, name, utilityType, endpoint);
  }

  changeEndpoint(newEndpoint: EndpointURL): void {
    const oldEndpoint = this.#endpoint;
    this.#endpoint = newEndpoint;
    this.addDomainEvent(
      new SmartFurnitureHookupEndpointChangedEvent(this, oldEndpoint),
    );
  }

  changeName(newName: SmartFurnitureHookupName): void {
    const oldName = this.#name;
    this.#name = newName;
    this.addDomainEvent(new SmartFurnitureHookupRenamedEvent(this, oldName));
  }

  prepareForDeletion(): void {
    this.addDomainEvent(new SmartFurnitureHookupDeletedEvent(this));
  }

  toString() {
    return {
      id: this.id.toString(),
      name: this.name.toString(),
      utilityType: this.utilityType.toString(),
      endpoint: this.endpoint.toString(),
    };
  }
}
