import { InvalidUtilityTypeError, UtilityTypeEmptyError } from "../errors";

export enum UtilityTypeEnum {
  GAS = "gas",
  WATER = "water",
  ELECTRICITY = "electricity",
}

export class UtilityType {
  private constructor(public readonly value: UtilityTypeEnum) {}

  static from(
    name: string,
  ): UtilityType | UtilityTypeEmptyError | InvalidUtilityTypeError {
    const trimmed = name.trim();
    if (!trimmed) {
      return new UtilityTypeEmptyError();
    }

    const utilityType =
      UtilityTypeEnum[trimmed.toUpperCase() as keyof typeof UtilityTypeEnum];

    if (!utilityType) {
      throw new InvalidUtilityTypeError(utilityType);
    }

    return new UtilityType(utilityType);
  }

  toString(): string {
    return this.value;
  }

  equals(other: UtilityType): boolean {
    return this.value === other.value;
  }
}

export abstract class ValueObject<TValue> {
  protected constructor(protected readonly value: TValue) {}

  equals(other: ValueObject<TValue>): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return String(this.value);
  }

  toJSON(): TValue {
    return this.value;
  }
}

export class test extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static from(id: string): test | UtilityTypeEmptyError {
    const trimmed = id.trim();

    if (!trimmed) {
      return new UtilityTypeEmptyError();
    }

    return new test(trimmed);
  }

  equals(other: test): boolean {
    return this.value === other.value;
  }
}

export class test2 extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static from(id: string): test2 | UtilityTypeEmptyError {
    const trimmed = id.trim();

    if (!trimmed) {
      return new UtilityTypeEmptyError();
    }

    return new test2(trimmed);
  }
}

export function testa() {
  const x = test.from("abc");
  if (x instanceof UtilityTypeEmptyError) {
    return "";
  }

  const y = test2.from("abcd");

  if (y instanceof UtilityTypeEmptyError) {
    return "";
  }

  x.equals(y);
}
