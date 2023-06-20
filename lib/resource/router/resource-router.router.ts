import express from 'express';
import { ResourceService } from '../resource.service';
import { createResourceController } from './resource-router.controller';
import { createRoute } from '../../server/router';
import { ResourceModel } from '../resource.model';
import { createJsonResponse } from '../../server/response';
import { ResourceRouterConfig } from '../contracts/resource-router.contract';

export function createResourceRouter<T>(
  model: ResourceModel,
  service: ResourceService<T>,
  config?: ResourceRouterConfig
): express.Router {
  const middleware = config?.middleware ?? [];

  return createRoute(createResourceController(model, service))
    .get(`/api/${model.table}`, (controller) => [
      ...middleware,
      createJsonResponse(controller.getAll),
    ])
    .get(`/api/${model.table}`, (controller) => [
      ...middleware,
      createJsonResponse(controller.store),
    ])
    .get(`/api/${model.table}/:id`, (controller) => [
      ...middleware,
      createJsonResponse(controller.getOneById),
    ])
    .patch(`/api/${model.table}/:id`, (controller) => [
      ...middleware,
      createJsonResponse(controller.updateOneById),
    ])
    .delete(`/api/${model.table}/:id`, (controller) => [
      ...middleware,
      createJsonResponse(controller.deleteOneById),
    ])
    .getRouter();
}
