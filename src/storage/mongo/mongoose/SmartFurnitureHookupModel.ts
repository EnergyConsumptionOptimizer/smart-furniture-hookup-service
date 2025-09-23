import { SmartFurnitureHookupDocument } from "./SmartFurnitureHookupDocument";
import { model, Schema } from "mongoose";

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
    consumptionType: {
      type: String,
      required: true,
    },
    consumptionUnit: {
      type: String,
      required: true,
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
