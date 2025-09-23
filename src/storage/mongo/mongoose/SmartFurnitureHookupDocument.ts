import { type Document } from "mongoose";

export interface SmartFurnitureHookupDocument extends Document {
  readonly _id: string;
  readonly name: string;
  readonly consumptionType: string;
  readonly consumptionUnit: string;
  readonly endpoint: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}
