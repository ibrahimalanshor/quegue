import { knex } from '../knex/knex';
import { Stored } from '../entity/types';
import {
  Deleteptions,
  FindOptions,
  Resource,
  StoreOptions,
} from './resource.type';
import { createWhereBuilder } from './resource.helper';

export abstract class ResourceModel {
  abstract table: string;
  abstract fillable: string[];
  abstract selectable: string[];
}

export class ResourceService<T, C> {
  constructor(public model: ResourceModel) {}

  async findOne(options: FindOptions): Promise<Stored<T>> {
    const columns = options.columns ? options.columns : this.model.selectable;

    const res = await knex(this.model.table)
      .where(createWhereBuilder(options.filter))
      .first(columns);

    return res as Stored<T>;
  }

  async store(values: C, options?: StoreOptions): Promise<Stored<T>> {
    const fillableValues = Object.fromEntries(
      this.model.fillable.map((col: string) => [col, values[col as keyof C]])
    );

    const [storedId] = await knex(this.model.table).insert(fillableValues);

    return this.findOne({
      filter: {
        id: {
          value: storedId,
        },
      },
      columns: options?.returnedColumns,
    });
  }

  async delete(options: Deleteptions) {
    await knex(this.model.table)
      .where(createWhereBuilder(options.filter))
      .delete();
  }
}

export function createResourceService<T, C>(
  model: ResourceModel
): ResourceService<T, C> {
  return new ResourceService<T, C>(model);
}

export function createResource<T, C = Partial<T>>(
  model: ResourceModel
): Resource<T, C> {
  return {
    service: createResourceService<T, C>(model),
  };
}
