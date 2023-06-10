import Knex from 'knex';
import { dbConfig } from '../../src/config/db.config';

export const knex = Knex({
  client: 'mysql2',
  connection: {
    user: dbConfig.user,
    host: dbConfig.host,
    password: dbConfig.password,
    database: dbConfig.name,
  },
});
