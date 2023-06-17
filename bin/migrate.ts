import '../lib/config/load-env';
import { DbMigration } from '../lib/db/migration';
import { RefreshTokenMigration } from '../src/db/migrations/refresh-token.migration';
import { ResetPasswordMigration } from '../src/db/migrations/reset-password.migration';
import { UserMigration } from '../src/db/migrations/user.migration';
import { VerificationMigration } from '../src/db/migrations/verification.migration';

async function runMigration() {
  const migrations: DbMigration[] = [
    new UserMigration(),
    new RefreshTokenMigration(),
    new VerificationMigration(),
    new ResetPasswordMigration(),
  ];
  for (const migration of [...migrations].reverse()) {
    await migration.drop();
  }
  for (const migration of migrations) {
    await migration.create();
  }
}

runMigration()
  .catch((err) => console.log(err))
  .finally(() => process.exit(0));
