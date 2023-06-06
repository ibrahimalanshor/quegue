import { hash } from '../../../lib/bcrypt/bcrypt';
import { knex } from '../../../lib/knex/knex';
import { StoredUser, User } from '../user/user.entity';
import { LoginValues, RegisterValues } from './auth.entity';

export class AuthRepository {
  async createUser(values: RegisterValues): Promise<StoredUser> {
    return await knex<User>('users').insert({
      ...values,
      password: await hash(values.password),
    });
  }

  async findUser(values: LoginValues): Promise<StoredUser> {
    return await knex<User>('users').select('email', 'password');
  }
}
