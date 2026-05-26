import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";
import { SmartFurnitureHookupID } from "@domain/values/SmartFurnitureHookupID";
import { SmartFurnitureHookupService } from "@application/inbound/SmartFurnitureHookupService";
import { SmartFurnitureHookupRepository } from "@domain/ports/SmartFurnitureHookupRepository";
import { MonitoringService } from "@application/outbound/MonitoringService";
import { IdGenerator } from "@application/outbound/IdGenerator";
import { UnitOfWork } from "@application/outbound/UnitOfWork";
import { EventPublisher } from "@application/outbound/EventPublisher";
import { BusinessMetrics } from "@application/outbound/BusinessMetrics";
import { SmartFurnitureHookupName } from "@domain/values/SmartFurnitureHookupName";
import { UtilityType } from "@domain/values/UtilityType";
import { EndpointURL } from "@domain/values/EndpointURL";
import { SmartFurnitureHookupNotFoundError, stripErrors } from "@domain/errors";

export class SmartFurnitureHookupServiceImpl implements SmartFurnitureHookupService {
  readonly #repository: SmartFurnitureHookupRepository;
  readonly #monitoringService: MonitoringService;
  readonly #idGenerator: IdGenerator;
  readonly #uow: UnitOfWork;
  readonly #eventPublisher: EventPublisher;
  readonly #metrics: BusinessMetrics;

  constructor(
    smartFurnitureHookupRepository: SmartFurnitureHookupRepository,
    monitoringService: MonitoringService,
    idGenerator: IdGenerator,
    uow: UnitOfWork,
    eventPublisher: EventPublisher,
    metrics: BusinessMetrics,
  ) {
    this.#repository = smartFurnitureHookupRepository;
    this.#monitoringService = monitoringService;
    this.#idGenerator = idGenerator;
    this.#uow = uow;
    this.#eventPublisher = eventPublisher;
    this.#metrics = metrics;
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

    await this.#uow.executeTransactionally(async () => {
      await this.#repository.saveSmartFurnitureHookup(
        smartFurnitureHookupEntity,
      );

      await this.#monitoringService.registerSmartFurnitureHookup(
        smartFurnitureHookupEntity.id,
        smartFurnitureHookupEntity.endpoint,
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
      await this.#monitoringService
        .disconnectSmartFurnitureHookup(smartFurnitureHookup.endpoint)
        .catch();

      await this.#repository.removeSmartFurnitureHookup(props.id);

      for (const event of smartFurnitureHookup.pullDomainEvents()) {
        await this.#eventPublisher.publish(event);
      }
    });

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

    if (props.endpoint) smartFurnitureHookup.changeEndpoint(props.endpoint);
    if (props.name) smartFurnitureHookup.changeName(props.name);

    await this.#uow.executeTransactionally(async () => {
      if (endpoint) {
        await this.#monitoringService.registerSmartFurnitureHookup(
          smartFurnitureHookup.id,
          smartFurnitureHookup.endpoint,
        );
      }

      await this.#repository.updateSmartFurnitureHookup(smartFurnitureHookup);

      for (const event of smartFurnitureHookup.pullDomainEvents()) {
        await this.#eventPublisher.publish(event);
      }
    });

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
