import { Knex } from 'knex';
import { knex } from '../knex/knex';
import {
  ResourceFilters,
  WithFilter,
  WithModify,
  WithSelect,
  WithValue,
} from './resource.service';

export function createWhereBuilder(
  filters?: ResourceFilters
): (builder: Knex.QueryBuilder) => void {
  return (builder: Knex.QueryBuilder) => {
    for (const key in filters) {
      if (filters[key].operator === 'null') {
        builder.whereNull(key);
      } else {
        builder.where(
          knex.raw(key),
          filters[key].operator ?? '=',
          filters[key].value
        );
      }
    }
  };
}

export function createFillableValues(
  options: Partial<WithModify> & WithValue & { fillable: string[] }
): Record<string, any> {
  return options.force
    ? options.values
    : Object.fromEntries(
        options.fillable.map((col: string) => [col, options.values[col]])
      );
}

export function createSelectedColumns(
  options: Partial<WithSelect> & { selectable: string[] }
): string[] {
  return options.columns ? options.columns : options.selectable;
}
