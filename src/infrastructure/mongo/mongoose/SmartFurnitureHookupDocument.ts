import { type Document } from "mongoose";
import { UtilityType } from "@domain/UtilityType";

export interface SmartFurnitureHookupDocument extends Document<string> {
  readonly _id: string;
  readonly name: string;
  readonly utilityType: UtilityType;
  readonly endpoint: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
