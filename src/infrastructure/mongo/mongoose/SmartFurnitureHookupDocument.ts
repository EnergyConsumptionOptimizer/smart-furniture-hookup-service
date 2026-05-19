import { type Document } from "mongoose";
import { UtilityTypeEnum } from "@domain/values/UtilityType";

export interface SmartFurnitureHookupDocument extends Document<string> {
  readonly _id: string;
  readonly name: string;
  readonly utilityType: UtilityTypeEnum;
  readonly endpoint: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
