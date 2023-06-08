import { knex } from '../knex/knex';
import { Stored } from '../entity/types';
import { FindOptions, Resource } from './resource.type';
import { createWhereBuilder } from './resource.helper';

export abstract class ResourceModel {
  abstract table: string;
  abstract fillable: string[];
  abstract selectable: string[];
}

export class ResourceService<T, C> {
  constructor(public model: ResourceModel) {}

  async findOne(options: FindOptions): Promise<Stored<T>> {
    const res = await knex(this.model.table)
      .where(createWhereBuilder(options.filter))
      .first(this.model.selectable);

    return res as Stored<T>;
  }

  async store(values: C): Promise<Stored<T>> {
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
    });
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
