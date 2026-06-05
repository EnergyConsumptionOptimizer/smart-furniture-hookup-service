import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";
import { SmartFurnitureHookupID } from "@domain/values/SmartFurnitureHookupID";
import { SmartFurnitureHookupService } from "@application/inbound/SmartFurnitureHookupService";
import { SmartFurnitureHookupRepository } from "@domain/ports/SmartFurnitureHookupRepository";
import { IdGenerator } from "@application/outbound/IdGenerator";
import { UnitOfWork } from "@application/outbound/UnitOfWork";
import { EventPublisher } from "@application/outbound/EventPublisher";
import { BusinessMetrics } from "@application/outbound/BusinessMetrics";
import { SmartFurnitureHookupName } from "@domain/values/SmartFurnitureHookupName";
import { UtilityType } from "@domain/values/UtilityType";
import { EndpointURL } from "@domain/values/EndpointURL";
import { SmartFurnitureHookupNotFoundError, stripErrors } from "@domain/errors";
import { PhysicalSmartFurnitureHookupCommunication } from "@application/outbound/PhysicalSmartFurnitureHookupCommunication";

export class SmartFurnitureHookupServiceImpl implements SmartFurnitureHookupService {
  readonly #repository: SmartFurnitureHookupRepository;
  readonly #deviceIngestionUrl: string;
  readonly #physicalSmartFurnitureHookupCommunication: PhysicalSmartFurnitureHookupCommunication;
  readonly #idGenerator: IdGenerator;
  readonly #uow: UnitOfWork;
  readonly #eventPublisher: EventPublisher;
  readonly #metrics: BusinessMetrics;

  constructor(
    smartFurnitureHookupRepository: SmartFurnitureHookupRepository,
    deviceIngestionUrl: string,
    physicalSmartFurnitureHookupCommunication: PhysicalSmartFurnitureHookupCommunication,
    idGenerator: IdGenerator,
    uow: UnitOfWork,
    eventPublisher: EventPublisher,
    metrics: BusinessMetrics,
  ) {
    this.#repository = smartFurnitureHookupRepository;
    this.#deviceIngestionUrl = deviceIngestionUrl;
    this.#physicalSmartFurnitureHookupCommunication =
      physicalSmartFurnitureHookupCommunication;
    this.#idGenerator = idGenerator;
    this.#uow = uow;
    this.#eventPublisher = eventPublisher;
    this.#metrics = metrics;
  }

  #buildDeviceIngestionUrl(smartFurnitureHookupID: string): string {
    return `${this.#deviceIngestionUrl}/api/measurements?smart_furniture_hookup_id=${smartFurnitureHookupID}`;
  }

  async #connectToPhysicalSmartFurnitureHookup(
    smartFurnitureHookup: SmartFurnitureHookup,
  ): Promise<undefined | Error> {
    return this.#physicalSmartFurnitureHookupCommunication.updateIngestingEndpoint(
      smartFurnitureHookup.endpoint.value,
      this.#buildDeviceIngestionUrl(smartFurnitureHookup.id.value),
    );
  }

  async #disconnectToPhysicalSmartFurnitureHookup(
    smartFurnitureHookup: SmartFurnitureHookup,
  ): Promise<undefined | Error> {
    return this.#physicalSmartFurnitureHookupCommunication.updateIngestingEndpoint(
      smartFurnitureHookup.endpoint.value,
      "",
    );
  }

  async createSmartFurnitureHookup(
    name: string,
    utilityType: string,
    endpoint: string,
  ): Promise<SmartFurnitureHookup | Error> {
    const props = stripErrors({
      id: SmartFurnitureHookupID.from(this.#idGenerator.generate()),
      name: SmartFurnitureHookupName.from(name),
      utilityType: UtilityType.from(utilityType),
      endpoint: EndpointURL.from(endpoint),
    });

    if (props instanceof Error) return props;

    const smartFurnitureHookupEntity = SmartFurnitureHookup.create(
      props.id,
      props.name,
      props.utilityType,
      props.endpoint,
    );

    const connectionResponse =
      await this.#connectToPhysicalSmartFurnitureHookup(
        smartFurnitureHookupEntity,
      );

    if (connectionResponse instanceof Error) return connectionResponse;

    await this.#uow.executeTransactionally(async () => {
      await this.#repository.saveSmartFurnitureHookup(
        smartFurnitureHookupEntity,
      );

      for (const event of smartFurnitureHookupEntity.pullDomainEvents()) {
        await this.#eventPublisher.publish(event);
      }
    });

    this.#metrics.recordSmartFurnitureHookupCreation();
    return smartFurnitureHookupEntity;
  }

  async deleteSmartFurnitureHookup(id: string): Promise<undefined | Error> {
    const props = stripErrors({
      id: SmartFurnitureHookupID.from(id),
    });

    if (props instanceof Error) return props;

    const smartFurnitureHookup = await this.#checkIfSmartFurnitureHookupExists(
      props.id,
    );

    if (smartFurnitureHookup instanceof Error) return smartFurnitureHookup;

    smartFurnitureHookup.prepareForDeletion();

    await this.#uow.executeTransactionally(async () => {
      await this.#repository.removeSmartFurnitureHookup(props.id);

      for (const event of smartFurnitureHookup.pullDomainEvents()) {
        await this.#eventPublisher.publish(event);
      }
    });

    await this.#disconnectToPhysicalSmartFurnitureHookup(smartFurnitureHookup);

    this.#metrics.recordSmartFurnitureHookupDeletion();
  }

  async getSmartFurnitureHookups(): Promise<SmartFurnitureHookup[]> {
    return this.#repository.findAllSmartFurnitureHookup();
  }

  async getSmartFurnitureHookup(
    id: string,
  ): Promise<SmartFurnitureHookup | Error> {
    const props = stripErrors({
      id: SmartFurnitureHookupID.from(id),
    });

    if (props instanceof Error) return props;

    const smartFurnitureHookup =
      await this.#repository.findSmartFurnitureHookupByID(props.id);

    if (!smartFurnitureHookup) return new SmartFurnitureHookupNotFoundError();

    return smartFurnitureHookup;
  }

  async updateSmartFurnitureHookup(
    id: string,
    name?: string,
    endpoint?: string,
  ): Promise<SmartFurnitureHookup | Error> {
    const props = stripErrors({
      id: SmartFurnitureHookupID.from(id),
      endpoint: endpoint ? EndpointURL.from(endpoint) : undefined,
      name: name ? SmartFurnitureHookupName.from(name) : undefined,
    });

    if (props instanceof Error) return props;

    const smartFurnitureHookup = await this.#checkIfSmartFurnitureHookupExists(
      props.id,
    );

    if (smartFurnitureHookup instanceof Error) {
      return smartFurnitureHookup;
    }

    if (props.endpoint) {
      smartFurnitureHookup.changeEndpoint(props.endpoint);
      const connectionResponse =
        await this.#connectToPhysicalSmartFurnitureHookup(smartFurnitureHookup);

      if (connectionResponse instanceof Error) return connectionResponse;
    }

    if (props.name) smartFurnitureHookup.changeName(props.name);

    await this.#repository.updateSmartFurnitureHookup(smartFurnitureHookup);

    this.#metrics.recordSmartFurnitureHookupUpdate();

    return smartFurnitureHookup;
  }

  async #checkIfSmartFurnitureHookupExists(id: SmartFurnitureHookupID) {
    const currentSmartFurnitureHookup =
      await this.#repository.findSmartFurnitureHookupByID(id);

    if (!currentSmartFurnitureHookup) {
      return new SmartFurnitureHookupNotFoundError();
    }

    return currentSmartFurnitureHookup;
  }
}
