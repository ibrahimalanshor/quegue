import autobind from 'autobind-decorator';
import { RouterContext } from '../../server/response';
import {
  createColumnValues,
  createFilterValues,
  createPaginatedValues,
  createQueryValues,
  createResourcesMeta,
  createSortValues,
} from '../resource.helper';
import {
  ResourceRow,
  ResourceRows,
  ResourceService,
  ResourcesPaginated,
} from '../resource.service';
import { ValidRawColumns } from '../contracts/resource-query.contract';
import { ResourceModel } from '../resource.model';
import { NoResultError } from '../../db/errors/no-result.error';
import { NotFoundError } from '../../server/http-error/not-found.error';

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
  constructor(
    public model: ResourceModel,
    public service: ResourceService<T>
  ) {}

  async getAll(context: RouterContext): Promise<ResourcesControllerResult<T>> {
    const query = await createQueryValues(context.req.query);
    const page = createPaginatedValues(query.page);
    const sort = createSortValues(query.sort ?? 'id');
    const columns = createColumnValues(
      (query.columns ?? {}) as ValidRawColumns
    );
    const filter = createFilterValues(query.filter ?? {});

    const res = (await this.service.findAll({
      paginated: true,
      limit: page.limit,
      offset: page.offset,
      sort,
      columns: columns[this.model.table],
      filter,
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
    try {
      return (await this.service.findOne({
        filter: {
          id: {
            operator: '=',
            value: context.req.params.id,
          },
        },
        throwOnNoResult: true,
      })) as ResourceRow<T>;
    } catch (err) {
      if (err instanceof NoResultError) {
        throw new NotFoundError();
      }

      throw err;
    }
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

export function createResourceController<T>(
  model: ResourceModel,
  service: ResourceService<T>
) {
  return new ResourceControler(model, service);
}
