import { Stored } from '../../../lib/entity/entity.type';
import { User } from '../user/user.entity';

export interface RefreshToken {
  token: string;
  user_id: number;
  expire_at: Date;
  user: Stored<User>;
}

export type StoredRefreshToken = Stored<RefreshToken>;
