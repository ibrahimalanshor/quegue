import { knex } from '../knex/knex';
import { Stored } from '../entity/entity.type';
import { createFillableValues, createWhereBuilder } from './resource.helper';
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

export type FindOptions = WithFilter & {
  columns?: string[];
  throwOnNoResult?: boolean;
};
export type Deleteptions = WithFilter & {
  throwOnNoAffected?: boolean;
};
export type StoreOptions = WithValue & Partial<WithModify>;
export type UpdateOptions = WithFilter & WithValue & Partial<WithModify>;

export class ResourceService<T> {
  constructor(public model: ResourceModel) {}

  async findOne(options: FindOptions): Promise<Stored<T>> {
    const columns = options.columns ? options.columns : this.model.selectable;

    const res = await knex(this.model.table)
      .where(createWhereBuilder(options.filter))
      .first(columns);

    if ((options?.throwOnNoResult ?? false) && res === undefined) {
      throw new NoResultError();
    }

    return res as Stored<T>;
  }

  async store(options: StoreOptions): Promise<Stored<T> | number> {
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

  async update(options: UpdateOptions): Promise<Stored<T> | number> {
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

  async delete(options: Deleteptions) {
    const affected = await knex(this.model.table)
      .where(createWhereBuilder(options.filter))
      .del();

    if ((options.throwOnNoAffected ?? false) && affected < 1) {
      throw new NoAffectedError();
    }
  }
}

export function createResourceService<T>(model: ResourceModel) {
  return new ResourceService<T>(model);
}
