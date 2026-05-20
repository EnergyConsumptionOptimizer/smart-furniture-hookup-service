export const DomainErrorCode = {
  EMPTY_FIELD: "EMPTY_FIELD",
  UNIQUE_FIELD_ALREADY_EXISTS: "UNIQUE_FIELD_ALREADY_EXISTS",
  INVALID_UTILITY_TYPE: "INVALID_UTILITY_TYPE",
  NOT_FOUND: "NOT_FOUND",
} as const;

export abstract class DomainError extends Error {
  public abstract readonly code: string;

  protected constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// ==========================================
// Empty Field Errors
// ==========================================

export abstract class EmptyFieldError extends DomainError {
  public readonly code = DomainErrorCode.EMPTY_FIELD;

  protected constructor(fieldName: string) {
    super(`${fieldName} must not be empty`);
  }
}

export class SmartFurnitureHookupNameEmptyError extends EmptyFieldError {
  constructor() {
    super("Smart furniture hookup name");
  }
}

export class UrlEmptyError extends EmptyFieldError {
  constructor() {
    super("URL");
  }
}

export class UtilityTypeEmptyError extends EmptyFieldError {
  constructor() {
    super("Utility type");
  }
}

export class IdEmptyError extends EmptyFieldError {
  constructor() {
    super("ID");
  }
}

// ==========================================
// Unique Field Conflict Errors
// ==========================================
export abstract class UniqueFieldAlreadyExistsError extends DomainError {
  public readonly code = DomainErrorCode.UNIQUE_FIELD_ALREADY_EXISTS;

  protected constructor(fieldName: string, fieldValue: string) {
    super(`${fieldName} ${fieldValue} already exists`);
  }
}

export class NameAlreadyExistsError extends UniqueFieldAlreadyExistsError {
  constructor(name: string) {
    super("Name", name);
  }
}

export class UrlAlreadyExistsError extends UniqueFieldAlreadyExistsError {
  constructor(url: string) {
    super("URL", url);
  }
}

// ==========================================
// Resource Not Found Errors
// ==========================================

export class NotFoundError extends DomainError {
  public readonly code = DomainErrorCode.NOT_FOUND;
  constructor(entityName = "Resource") {
    super(`${entityName} not found`);
  }
}

export class SmartFurnitureHookupNotFoundError extends NotFoundError {
  constructor() {
    super("Smart furniture hookup");
  }
}

// ==========================================
// Other Domain Errors
// ==========================================

export class InvalidUtilityTypeError extends DomainError {
  public readonly code = DomainErrorCode.INVALID_UTILITY_TYPE;
  constructor(type: string) {
    super(`Invalid utility type: ${type}`);
  }
}
