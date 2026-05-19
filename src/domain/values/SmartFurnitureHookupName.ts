import { SmartFurnitureHookupNameEmptyError } from "@domain/errors";

export class SmartFurnitureHookupName {
  private constructor(public readonly value: string) {}

  static from(
    name: string,
  ): SmartFurnitureHookupName | SmartFurnitureHookupNameEmptyError {
    const trimmed = name.trim();
    if (!trimmed) {
      return new SmartFurnitureHookupNameEmptyError();
    }
    return new SmartFurnitureHookupName(trimmed);
  }

  toString(): string {
    return this.value;
  }

  equals(other: SmartFurnitureHookupName): boolean {
    return this.value === other.value;
  }
}
