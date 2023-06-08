import { ResourceService } from './resource';

export interface Resource<T, C> {
  service: ResourceService<T, C>;
}
export interface FilterOptions {
  operator?: string;
  value: any;
}
export type FilterParams = {
  [key: string]: FilterOptions;
};
export interface FindOptions {
  filter?: FilterParams;
}
