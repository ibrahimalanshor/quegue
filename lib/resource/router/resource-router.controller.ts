import autobind from 'autobind-decorator';
import { RouterContext } from '../../server/response';
import {
  createPaginatedValues,
  createQueryValues,
  createResourcesMeta,
} from '../resource.helper';
import {
  ResourceRow,
  ResourceRows,
  ResourceService,
  ResourcesPaginated,
} from '../resource.service';

export interface ResourceMeta {
  total: number;
  from: number;
  to: number;
  current: number;
}
export interface ResourcesControllerResult<T> {
  meta: ResourceMeta;
  rows: ResourceRows<T>;
}

@autobind
export class ResourceControler<T> {
  constructor(public service: ResourceService<T>) {}

  async getAll(context: RouterContext): Promise<ResourcesControllerResult<T>> {
    const query = await createQueryValues(context.req.query);
    const page = createPaginatedValues(query.page);

    const res = (await this.service.findAll({
      paginated: true,
      limit: page.limit,
      offset: page.offset,
    })) as ResourcesPaginated<T>;

    return {
      meta: createResourcesMeta({
        count: res.count,
        limit: page.limit,
        offset: page.offset,
      }),
      rows: res.rows,
    };
  }

  async store(context: RouterContext): Promise<ResourceRow<T>> {
    return (await this.service.store({
      values: context.req.body,
      returning: true,
    })) as ResourceRow<T>;
  }

  async getOneById(context: RouterContext): Promise<ResourceRow<T>> {
    return (await this.service.findOne({
      filter: {
        id: {
          operator: '=',
          value: context.req.params.id,
        },
      },
    })) as ResourceRow<T>;
  }

  async updateOneById(context: RouterContext): Promise<ResourceRow<T>> {
    return (await this.service.update({
      filter: {
        id: {
          operator: '=',
          value: context.req.params.id,
        },
      },
      values: context.req.body,
      returning: true,
    })) as ResourceRow<T>;
  }

  async deleteOneById(context: RouterContext): Promise<void> {
    await this.service.delete({
      filter: {
        id: {
          operator: '=',
          value: context.req.params.id,
        },
      },
    });
  }
}

export function createResourceController<T>(service: ResourceService<T>) {
  return new ResourceControler(service);
}
