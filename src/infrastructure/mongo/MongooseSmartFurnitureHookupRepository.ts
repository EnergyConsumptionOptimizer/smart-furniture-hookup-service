import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";
import { SmartFurnitureHookupID } from "@domain/values/SmartFurnitureHookupID";
import {
  SmartFurnitureHookupMapper,
  SmartFurnitureHookupModel,
} from "./mongoose/SmartFurnitureHookupModel";
import { MongoServerError } from "mongodb";
import { SmartFurnitureHookupRepository } from "@domain/ports/SmartFurnitureHookupRepository";
import { Logger } from "pino";
import {
  NameAlreadyExistsError,
  SmartFurnitureHookupNotFoundError,
  UrlAlreadyExistsError,
} from "@domain/errors";
import { mongoSessionContext } from "@infrastructure/mongo/mongoSessionContext";

export class MongooseSmartFurnitureHookupRepository implements SmartFurnitureHookupRepository {
  readonly #logger?: Logger;

  constructor(logger?: Logger) {
    this.#logger = logger;
  }

  private handleMongoSmartFurnitureHookupConflict(
    error: MongoServerError,
    smartFurnitureHookup: SmartFurnitureHookup,
  ) {
    if (Object.keys(error.keyPattern)[0] === "name")
      throw new NameAlreadyExistsError(smartFurnitureHookup.name.toString());
    if (Object.keys(error.keyPattern)[0] === "endpoint")
      throw new UrlAlreadyExistsError(smartFurnitureHookup.endpoint.toString());
  }

  async saveSmartFurnitureHookup(
    smartFurnitureHookup: SmartFurnitureHookup,
  ): Promise<SmartFurnitureHookup> {
    const session = mongoSessionContext.getStore();

    try {
      const smartFurnitureHookupDocument = new SmartFurnitureHookupModel(
        SmartFurnitureHookupMapper.toPersistence(smartFurnitureHookup),
      );

      return SmartFurnitureHookupMapper.toDomain(
        await smartFurnitureHookupDocument.save({
          session: session,
        }),
      );
    } catch (error) {
      if ((error as MongoServerError).code === 11000) {
        this.#logger?.warn(
          { smartFurnitureHookupId: smartFurnitureHookup.id.toString() },
          "Concurrency conflict: duplicate key on save",
        );

        this.handleMongoSmartFurnitureHookupConflict(
          error as MongoServerError,
          smartFurnitureHookup,
        );
      }

      throw error;
    }
  }

  async findAllSmartFurnitureHookup(): Promise<SmartFurnitureHookup[]> {
    const smartFurnitureHookupDocuments = await SmartFurnitureHookupModel.find()
      .lean()
      .exec();

    return smartFurnitureHookupDocuments.map(
      SmartFurnitureHookupMapper.toDomain,
    );
  }

  async findSmartFurnitureHookupByID(
    id: SmartFurnitureHookupID,
  ): Promise<SmartFurnitureHookup | null> {
    const smartFurnitureHookupDocument =
      await SmartFurnitureHookupModel.findById(id.value).lean().exec();

    return smartFurnitureHookupDocument
      ? SmartFurnitureHookupMapper.toDomain(smartFurnitureHookupDocument)
      : null;
  }

  async updateSmartFurnitureHookup(
    smartFurnitureHookup: SmartFurnitureHookup,
  ): Promise<void> {
    let updatedDocument;

    const session = mongoSessionContext.getStore();

    try {
      updatedDocument = await SmartFurnitureHookupModel.findByIdAndUpdate(
        smartFurnitureHookup.id.value,
        {
          name: smartFurnitureHookup.name,
          endpoint: smartFurnitureHookup.endpoint,
        },
        {
          session,
          runValidators: true,
        },
      ).exec();
    } catch (error) {
      if ((error as MongoServerError).code === 11000) {
        this.handleMongoSmartFurnitureHookupConflict(
          error as MongoServerError,
          smartFurnitureHookup,
        );
      }
      throw error;
    }

    if (!updatedDocument) {
      throw new SmartFurnitureHookupNotFoundError();
    }
  }

  async removeSmartFurnitureHookup(id: SmartFurnitureHookupID): Promise<void> {
    const session = mongoSessionContext.getStore();
    const result = await SmartFurnitureHookupModel.findByIdAndDelete(id.value, {
      session,
    }).exec();

    if (!result) {
      throw new SmartFurnitureHookupNotFoundError();
    }
  }
}
