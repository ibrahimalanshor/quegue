import { Knex } from 'knex';
import { DbMigration } from '../../../lib/db/migration';

export class UserMigration extends DbMigration {
  async drop(): Promise<void> {
    await this.schema.dropTableIfExists('users');
  }

  async create(): Promise<void> {
    await this.schema.createTable(
      'users',
      (tableBuilder: Knex.CreateTableBuilder) => {
        tableBuilder.bigIncrements('id');
        tableBuilder.string('email').unique();
        tableBuilder.string('username');
        tableBuilder.string('name');
        tableBuilder.string('password');
        tableBuilder.timestamp('verified_at').nullable();
        tableBuilder.timestamp('deleted_at').nullable();
        tableBuilder.timestamps(true, true);
      }
    );
  }
}
