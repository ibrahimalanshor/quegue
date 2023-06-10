import { Knex } from 'knex';
import { knex } from '../knex/knex';

export abstract class DbMigration {
  schema: Knex.SchemaBuilder = knex.schema;

  abstract drop(): Promise<void>;
  abstract create(): Promise<void>;
}
