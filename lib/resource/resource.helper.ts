import { Knex } from 'knex';
import { FilterParams } from './resource.type';
import { knex } from '../knex/knex';

export function createWhereBuilder(
  filters?: FilterParams
): (builder: Knex.QueryBuilder) => void {
  return (builder: Knex.QueryBuilder) => {
    for (const key in filters) {
      builder.where(
        knex.raw(key),
        filters[key].operator ?? '=',
        filters[key].value
      );
    }
  };
}
