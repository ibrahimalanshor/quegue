import { ResourceService } from './resource.service';
import express from 'express';

export interface Resource<T> {
  service: ResourceService<T>;
  router: express.Router;
}

export interface ResourceConfig {
  middleware?: express.RequestHandler[];
}
