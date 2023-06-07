import { knex } from '../knex/knex';
import { Stored } from '../entity/types';
import { FindOptions, Resource, ResourceModel } from './resource.type';
import { createWhereBuilder } from './resource.helper';

class ResourceService<T, C> {
  constructor(public model: ResourceModel) {}

  async findOne(options: FindOptions): Promise<Stored<T>> {
    const res = await knex(this.model.table)
      .where(createWhereBuilder(options.filter))
      .first(this.model.fillable);

    return res as Stored<T>;
  }

  async store(values: C): Promise<Stored<T>> {
    const [storedId] = await knex(this.model.table).insert(values);

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
