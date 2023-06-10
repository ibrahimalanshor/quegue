import { Stored } from '../../../lib/entity/types';
import { User } from '../user/user.entity';

export interface RefreshToken {
  token: String;
  user: Stored<User>;
}

export type StoredRefreshToken = Stored<RefreshToken>;
