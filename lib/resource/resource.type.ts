import { Stored } from '../entity/types';

export interface Resource<T, C> {
  service: ResourceService<T, C>;
}
export interface ResourceModel {
  table: string;
  fillable: string[];
  selectable: string[];
}
export interface ResourceService<T, C> {
  findOne(options: FindOptions): Promise<Stored<T>>;
  store(values: C): Promise<T>;
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
