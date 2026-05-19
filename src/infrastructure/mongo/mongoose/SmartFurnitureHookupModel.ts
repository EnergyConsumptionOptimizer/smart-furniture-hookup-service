import { SmartFurnitureHookupDocument } from "./SmartFurnitureHookupDocument";
import { model, Schema } from "mongoose";
import { UtilityType, UtilityTypeEnum } from "@domain/values/UtilityType";
import { SmartFurnitureHookup } from "@domain/entities/SmartFurnitureHookup";
import { SmartFurnitureHookupID } from "@domain/values/SmartFurnitureHookupID";
import { SmartFurnitureHookupName } from "@domain/values/SmartFurnitureHookupName";
import { EndpointURL } from "@domain/values/EndpointURL";

const smartFurnitureHookupSchema = new Schema<SmartFurnitureHookupDocument>(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    utilityType: {
      type: String,
      required: true,
      enum: Object.values(UtilityTypeEnum),
    },
    endpoint: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

export const SmartFurnitureHookupModel = model<SmartFurnitureHookupDocument>(
  "SmartFurnitureHookup",
  smartFurnitureHookupSchema,
);

export const SmartFurnitureHookupMapper = {
  toPersistence(domain: SmartFurnitureHookup) {
    return {
      _id: domain.id.toString(),
      name: domain.name.toString(),
      utilityType: domain.utilityType.toString(),
      endpoint: domain.endpoint.toString(),
    };
  },

  toDomain(
    document: Pick<
      SmartFurnitureHookupDocument,
      "_id" | "name" | "utilityType" | "endpoint"
    >,
  ): SmartFurnitureHookup {
    return SmartFurnitureHookup.rehydrate(
      SmartFurnitureHookupID.from(document._id) as SmartFurnitureHookupID,
      SmartFurnitureHookupName.from(document.name) as SmartFurnitureHookupName,
      UtilityType.from(document.utilityType) as UtilityType,
      EndpointURL.from(document.endpoint) as EndpointURL,
    );
  },
};
