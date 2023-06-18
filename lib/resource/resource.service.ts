import { knex } from '../knex/knex';
import { Stored } from '../entity/entity.type';
import {
  createFillableValues,
  createSelectedColumns,
  createWhereBuilder,
} from './resource.helper';
import { NoResultError } from '../db/errors/no-result.error';
import { ConflictError } from '../db/errors/conflict.error';
import { NoAffectedError } from '../db/errors/no-affected.error';
import { ResourceModel } from './resource.model';

export interface PropertyFilter {
  operator?: string;
  value: any;
}
export type ResourceFilters = {
  [key: string]: PropertyFilter;
};
export type WithSelect = {
  columns: string[];
};
export type WithFilter = {
  filter: ResourceFilters;
};
export type WithValue = {
  values: Record<string, any>;
};
export type WithModify = {
  returning: boolean;
  returned: string[];
  force: boolean;
};
export type Paginated<T> = {
  count: number;
  rows: T[];
};

export class ResourceService<T> {
  constructor(public model: ResourceModel) {}

  async findAll(
    options: Partial<WithFilter> &
      Partial<WithSelect> & {
        paginated?: boolean;
        limit?: number;
        offset?: number;
        sort?: {
          column: string;
          direction: 'asc' | 'desc';
        };
      }
  ): Promise<Stored<T>[] | Paginated<Stored<T>>> {
    const columns = createSelectedColumns({
      selectable: this.model.selectable,
      columns: options.columns,
      hidden: this.model.hidden,
    });

    const query = knex(this.model.table)
      .where(createWhereBuilder(options.filter))
      .orderBy(options.sort?.column || 'id', options.sort?.direction);

    if (options.limit || options.paginated) {
      query.limit(options.limit || 10);
    }

    if (options.offset || options.paginated) {
      query.offset(options.offset || 1);
    }

    const rows = (await query.select(columns)) as Stored<T>[];

    if (!options.paginated) {
      return rows;
    }

    return {
      count: await this.count({ filter: options.filter }),
      rows: rows,
    };
  }

  async findOne(
    options: WithFilter &
      Partial<WithSelect> & {
        throwOnNoResult?: boolean;
      }
  ): Promise<Stored<T>> {
    const columns = createSelectedColumns({
      selectable: this.model.selectable,
      columns: options.columns,
      hidden: this.model.hidden,
    });

    const res = await knex(this.model.table)
      .where(createWhereBuilder(options.filter))
      .first(columns);

    if ((options?.throwOnNoResult ?? false) && res === undefined) {
      throw new NoResultError();
    }

    return res as Stored<T>;
  }

  async store(
    options: WithValue & Partial<WithModify>
  ): Promise<Stored<T> | number> {
    try {
      const fillableValues = createFillableValues({
        values: options.values,
        force: options.force,
        fillable: this.model.fillable,
      });

      const [storedId] = await knex(this.model.table).insert(fillableValues);

      if (!(options.returning ?? true)) {
        return storedId;
      }

      return await this.findOne({
        filter: {
          id: {
            value: storedId,
          },
        },
        columns: options.returned,
      });
    } catch (err: any) {
      if (err.errno === 1062) {
        throw new ConflictError();
      }

      throw err;
    }
  }

  async update(
    options: WithFilter & WithValue & Partial<WithModify>
  ): Promise<Stored<T> | number> {
    try {
      const fillableValues = createFillableValues({
        values: options.values,
        force: options.force,
        fillable: this.model.fillable,
      });

      const res = await knex(this.model.table)
        .where(createWhereBuilder(options.filter))
        .update(fillableValues);

      if (!(options.returning ?? true)) {
        return res;
      }

      return await this.findOne({
        filter: options.filter,
        columns: options.returned,
      });
    } catch (err: any) {
      if (err.errno === 1062) {
        throw new ConflictError();
      }

      throw err;
    }
  }

  async delete(
    options: WithFilter & {
      throwOnNoAffected?: boolean;
    }
  ) {
    const affected = await knex(this.model.table)
      .where(createWhereBuilder(options.filter))
      .del();

    if ((options.throwOnNoAffected ?? false) && affected < 1) {
      throw new NoAffectedError();
    }
  }

  async count(options: Partial<WithFilter>): Promise<number> {
    const res = await knex(this.model.table)
      .where(createWhereBuilder(options.filter))
      .count('id as count');

    return res[0].count as number;
  }
}

export function createResourceService<T>(model: ResourceModel) {
  return new ResourceService<T>(model);
}
