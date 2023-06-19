import { ValidationError } from 'class-validator';

export class ValidationSchemaError {
  errors: Record<string, string>;

  constructor(errors: ValidationError[]) {
    this.mapError(errors);
  }

  mapError(errors: ValidationError[]) {
    this.errors = Object.fromEntries(
      errors.map((value: ValidationError) => {
        return [
          value.property,
          value.children?.length
            ? value.children[0].constraints
              ? Object.values(value.children[0].constraints)[0]
              : ''
            : value.constraints
            ? Object.values(value.constraints)[0]
            : '',
        ];
      })
    );
  }
}
