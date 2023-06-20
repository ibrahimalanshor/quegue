import { ResourceConfig } from './contracts/resource.contract';
import { ResourceModel } from './resource.model';
import { createResourceService } from './resource.service';
import { Resource } from './resource.type';
import { createResourceRouter } from './router/resource-router.router';

export function createResource<T>(
  model: ResourceModel,
  config?: ResourceConfig
): Resource<T> {
  const service = createResourceService<T>(model);

  return {
    service,
    router: createResourceRouter(model, service, config?.routerConfig),
  };
}
