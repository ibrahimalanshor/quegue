import { Knex } from 'knex';
import { DbMigration } from '../../../lib/db/migration';

export class VerificationMigration extends DbMigration {
  async drop(): Promise<void> {
    await this.schema.dropTableIfExists('verifications');
  }

  async create(): Promise<void> {
    await this.schema.createTable(
      'verifications',
      (tableBuilder: Knex.CreateTableBuilder) => {
        tableBuilder.bigIncrements('id');
        tableBuilder.string('token').notNullable();
        tableBuilder.timestamp('expire_at').notNullable();
        tableBuilder.bigInteger('user_id').unsigned().notNullable();
        tableBuilder.timestamps(true, true);
        tableBuilder
          .foreign('user_id')
          .references('users.id')
          .onDelete('CASCADE');
      }
    );
  }
}
