import { Stored } from '../../../lib/entity/types';
import { User } from '../user/user.entity';

export interface VerificationToken {
  token: string;
  expire_at: Date;
  user_id: number;
  user: Stored<User>;
}

export type StoredVerificationToken = Stored<VerificationToken>;
