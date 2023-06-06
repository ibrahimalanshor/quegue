import { Stored } from '../../../lib/entity/types';

export interface User {
  name: string;
  username: string;
  email: string;
  password: string;
}

export type StoredUser = Stored<User>;
