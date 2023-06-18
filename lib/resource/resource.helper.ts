import { Knex } from 'knex';
import { knex } from '../knex/knex';
import { ResourceFilters } from './resource.type';

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
