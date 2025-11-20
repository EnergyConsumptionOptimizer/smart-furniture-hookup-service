import { SmartFurnitureHookupRepository } from "@domain/ports/SmartFurnitureHookupRepository";
import { SmartFurnitureHookup } from "@domain/SmartFurnitureHookup";
import { SmartFurnitureHookupID } from "@domain/SmartFurnitureHookupID";
import { v4 as uuidv4, validate } from "uuid";
import { SmartFurnitureHookupDocument } from "./mongoose/SmartFurnitureHookupDocument";
import { SmartFurnitureHookupModel } from "./mongoose/SmartFurnitureHookupModel";
import {
  InvalidIDError,
  SmartFurnitureHookupEndpointConflictError,
  SmartFurnitureHookupNameConflictError,
  SmartFurnitureHookupNotFoundError,
} from "@domain/errors/errors";
import { MongoServerError } from "mongodb";

export class MongooseSmartFurnitureHookupRepository
  implements SmartFurnitureHookupRepository
{
  private handleMongoSmartFurnitureHookupConflict(
    error: MongoServerError,
    smartFurnitureHookup: SmartFurnitureHookup,
  ) {
    if (Object.keys(error.keyPattern)[0] === "name")
      throw new SmartFurnitureHookupNameConflictError(
        smartFurnitureHookup.name,
      );

    if (Object.keys(error.keyPattern)[0] === "endpoint")
      throw new SmartFurnitureHookupEndpointConflictError(
        smartFurnitureHookup.endpoint,
      );
  }

  async saveSmartFurnitureHookup(
    smartFurnitureHookup: SmartFurnitureHookup,
  ): Promise<SmartFurnitureHookup> {
    const id = uuidv4();

    try {
      const smartFurnitureHookupDocument = new SmartFurnitureHookupModel({
        ...smartFurnitureHookup,
        _id: id,
      });

      return this.mapToSmartFurnitureHookup(
        await smartFurnitureHookupDocument.save(),
      );
    } catch (error) {
      if ((error as MongoServerError).code === 11000) {
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

    return smartFurnitureHookupDocuments.map(this.mapToSmartFurnitureHookup);
  }

  async findSmartFurnitureHookupByID(
    id: SmartFurnitureHookupID,
  ): Promise<SmartFurnitureHookup | null> {
    this.validateSmartFurnitureHookupID(id.value);

    const smartFurnitureHookupDocument =
      await SmartFurnitureHookupModel.findById(id.value).lean().exec();

    return smartFurnitureHookupDocument
      ? this.mapToSmartFurnitureHookup(smartFurnitureHookupDocument)
      : null;
  }

  async updateSmartFurnitureHookup(
    smartFurnitureHookup: SmartFurnitureHookup,
  ): Promise<SmartFurnitureHookup> {
    this.validateSmartFurnitureHookupID(smartFurnitureHookup.id.value);

    let updatedDocument;

    try {
      updatedDocument = await SmartFurnitureHookupModel.findByIdAndUpdate(
        smartFurnitureHookup.id.value,
        {
          name: smartFurnitureHookup.name,
          endpoint: smartFurnitureHookup.endpoint,
        },
        { new: true, runValidators: true },
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

    return this.mapToSmartFurnitureHookup(updatedDocument);
  }

  async removeSmartFurnitureHookup(id: SmartFurnitureHookupID): Promise<void> {
    this.validateSmartFurnitureHookupID(id.value);

    const result = await SmartFurnitureHookupModel.findByIdAndDelete(
      id.value,
    ).exec();

    if (!result) {
      throw new SmartFurnitureHookupNotFoundError();
    }
  }

  private mapToSmartFurnitureHookup(
    document: Pick<
      SmartFurnitureHookupDocument,
      "_id" | "name" | "utilityType" | "endpoint"
    >,
  ): SmartFurnitureHookup {
    return {
      id: { value: document._id },
      name: document.name,
      utilityType: document.utilityType,
      endpoint: document.endpoint,
    };
  }

  private validateSmartFurnitureHookupID(value: string) {
    if (!validate(value)) {
      throw new InvalidIDError();
    }
  }
}
