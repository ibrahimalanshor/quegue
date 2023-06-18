import { ResourceService } from './resource';

export interface Resource<T> {
  service: ResourceService<T>;
}

export interface PropertyFilter {
  operator?: string;
  value: any;
}
export type ResourceFilters = {
  [key: string]: PropertyFilter;
};
export type WithFilter = {
  filter: ResourceFilters;
};
export type WithValue = {
  values: Record<string, any>;
};
export type WithModify = {
  returning: boolean;
  returned: string[];
  force: boolean;
};

export type FindOptions = WithFilter & {
  columns?: string[];
  throwOnNoResult?: boolean;
};
export type Deleteptions = WithFilter & {
  throwOnNoAffected?: boolean;
};
export type StoreOptions = WithValue & Partial<WithModify>;
export type UpdateOptions = WithFilter & WithValue & Partial<WithModify>;
