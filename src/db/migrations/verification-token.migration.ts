import { Knex } from 'knex';
import { DbMigration } from '../../../lib/db/migration';

export class VerificationTokenMigration extends DbMigration {
  async drop(): Promise<void> {
    await this.schema.dropTableIfExists('verification_tokens');
  }

  async create(): Promise<void> {
    await this.schema.createTable(
      'verification_tokens',
      (tableBuilder: Knex.CreateTableBuilder) => {
        tableBuilder.bigIncrements('id');
        tableBuilder.string('token');
        tableBuilder.bigInteger('user_id').unsigned();
        tableBuilder.timestamps(true, true);
        tableBuilder
          .foreign('user_id')
          .references('users.id')
          .onDelete('CASCADE');
      }
    );
  }
}
