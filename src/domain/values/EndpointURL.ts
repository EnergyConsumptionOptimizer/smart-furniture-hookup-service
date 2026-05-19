import { UrlEmptyError } from "@domain/errors";

export class EndpointURL {
  private constructor(public readonly value: string) {}

  static from(URL: string): EndpointURL | UrlEmptyError {
    const trimmed = URL.trim();
    if (!trimmed) {
      return new UrlEmptyError();
    }
    return new EndpointURL(trimmed);
  }

  toString(): string {
    return this.value;
  }

  equals(other: EndpointURL): boolean {
    return this.value === other.value;
  }
}
