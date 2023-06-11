import { ResourceService } from './resource';

export interface Resource<T> {
  service: ResourceService<T>;
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
  columns?: string[];
  throwOnNoResult?: boolean;
}
export interface Deleteptions {
  filter?: FilterParams;
}
export interface StoreOptions {
  values: Record<string, any>;
  returnCreated?: boolean;
  returnedColumns?: string[];
  force?: boolean;
}
export interface UpdateOptions {
  values: Record<string, any>;
  filter?: FilterParams;
  returnCreated?: boolean;
  returnedColumns?: string[];
  force?: boolean;
}
