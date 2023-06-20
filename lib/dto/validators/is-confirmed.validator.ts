import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { getString } from '../../string/string-resource';

export function IsConfirmed(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (obj: Object, propertyName: string) {
    registerDecorator({
      name: 'isConfirmed',
      target: obj.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        defaultMessage: function (args: ValidationArguments) {
          return getString('validation.confirmed', {
            field: args.property,
            related: args.constraints[0],
          }) as string;
        },
        validate: function (value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          return value === relatedValue;
        },
      },
    });
  };
}
