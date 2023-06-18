import { ResourceService } from './resource.service';

export interface Resource<T> {
  service: ResourceService<T>;
}
