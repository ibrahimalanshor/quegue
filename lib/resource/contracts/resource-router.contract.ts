import express from 'express';

export interface ResourceRouterConfig {
  middleware?: express.RequestHandler[];
}
