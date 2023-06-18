import { ResourceModel } from './resource.model';
import { createResourceService } from './resource.service';
import { Resource } from './resource.type';

export function createResource<T>(model: ResourceModel): Resource<T> {
  return {
    service: createResourceService<T>(model),
  };
}
