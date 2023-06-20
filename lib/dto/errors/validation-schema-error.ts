import { ValidationError } from 'class-validator';

function getValueError(value: ValidationError) {
  return value.children?.length
    ? Object.fromEntries(
        value.children.map((childValue) => [
          childValue.property,
          childValue.constraints
            ? Object.values(childValue.constraints)[0]
            : '',
        ])
      )
    : value.constraints
    ? Object.values(value.constraints)[0]
    : '';
}

export class ValidationSchemaError {
  errors: Record<string, string | Record<string, string>>;

  constructor(errors: ValidationError[]) {
    this.mapError(errors);
  }

  mapError(errors: ValidationError[]) {
    this.errors = Object.fromEntries(
      errors.map((value: ValidationError) => {
        return [value.property, getValueError(value)];
      })
    );
  }
}
