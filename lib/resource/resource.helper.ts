import { Knex } from 'knex';
import { knex } from '../knex/knex';
import { WithModify, WithSelect, WithValue } from './resource.service';
import { ResourceMeta } from './router/resource-router.controller';
import { ResourcePage, ResourceQuery } from './router/resource-router.dto';
import { plainToClass } from 'class-transformer';
import { ValidationError, validateOrReject } from 'class-validator';
import { ValidationSchemaError } from '../dto/errors/validation-schema-error';
import { BadRequestError } from '../server/http-error/bad-request.error';
import {
  ColumnsValues,
  FilterValues,
  SortValues,
  ValidRawColumns,
} from './contracts/query.contract';

export function createWhereBuilder(
  filters?: FilterValues
): (builder: Knex.QueryBuilder) => void {
  return (builder: Knex.QueryBuilder) => {
    for (const key in filters) {
      if (filters[key].operator === 'null') {
        builder.whereNull(key);
      } else if (filters[key].operator === 'like') {
        builder.whereILike(key, `%${filters[key].value}%`);
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
  options: Partial<WithSelect> & { selectable: string[]; hidden: string[] }
): string[] {
  return options.columns && options.columns.length
    ? options.columns
    : options.selectable.filter((column) => !options.hidden.includes(column));
}

export function createPaginatedValues(page: { size: number; number: number }): {
  limit: number;
  offset: number;
} {
  const size = page?.size ?? 10;
  const number = page?.number ?? 1;

  return {
    limit: size,
    offset: (number - 1) * size,
  };
}

export function createResourcesMeta(options: {
  count: number;
  limit: number;
  offset: number;
}): ResourceMeta {
  return {
    total: options.count,
    from: options.offset,
    to: options.limit,
    current: options.offset / options.limit + 1,
  };
}

export function createPageFromQuery(page: Record<string, any>): {
  size: number;
  number: number;
} {
  return plainToClass(
    ResourcePage,
    {
      size: Number(page?.size ?? 10),
      number: Number(page?.number ?? 1),
    },
    { excludeExtraneousValues: true }
  );
}

export function createSortValues(rawColumn: string): SortValues {
  const isDesc = rawColumn.charAt(0) === '-';
  const column = isDesc ? rawColumn.slice(1) : rawColumn;

  return {
    column,
    direction: isDesc ? 'desc' : 'asc',
  };
}

export function createColumnValues(rawColumns: ValidRawColumns): ColumnsValues {
  return Object.fromEntries(
    Object.entries(rawColumns).map(([column, value]) => [
      column,
      value.split(','),
    ])
  );
}

export function createFilterValues(
  rawFilters: Record<string, any>
): FilterValues {
  return Object.fromEntries(
    Object.entries(rawFilters).map(([rawColumn, value]) => {
      const [column, operator] = rawColumn.split('|');

      return [
        column,
        {
          operator: operator ?? '=',
          value: value,
        },
      ];
    })
  );
}

export async function createQueryValues(
  plainQuery: Record<string, any>
): Promise<ResourceQuery> {
  try {
    if (typeof plainQuery.page === 'object') {
      plainQuery.page = createPageFromQuery(plainQuery.page);
    }

    const query = plainToClass(ResourceQuery, plainQuery, {
      excludeExtraneousValues: true,
    });

    await validateOrReject(query);

    return query;
  } catch (err) {
    if (Array.isArray(err)) {
      throw new BadRequestError(
        new ValidationSchemaError(err as ValidationError[]).errors
      );
    }

    throw err;
  }
}
