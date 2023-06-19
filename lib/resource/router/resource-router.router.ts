import express from 'express';
import { ResourceService } from '../resource.service';
import { createResourceController } from './resource-router.controller';
import { createRoute } from '../../server/router';
import { ResourceModel } from '../resource.model';
import { createJsonResponse } from '../../server/response';

export function createResourceRouter<T>(
  model: ResourceModel,
  service: ResourceService<T>
): express.Router {
  return createRoute(createResourceController(model, service))
    .get(`/api/${model.table}`, (controller) =>
      createJsonResponse(controller.getAll)
    )
    .get(`/api/${model.table}`, (controller) =>
      createJsonResponse(controller.store)
    )
    .get(`/api/${model.table}/:id`, (controller) =>
      createJsonResponse(controller.getOneById)
    )
    .patch(`/api/${model.table}/:id`, (controller) =>
      createJsonResponse(controller.updateOneById)
    )
    .delete(`/api/${model.table}/:id`, (controller) =>
      createJsonResponse(controller.deleteOneById)
    )
    .getRouter();
}
