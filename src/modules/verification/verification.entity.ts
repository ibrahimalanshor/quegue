import { Stored } from '../../../lib/entity/entity.type';
import { User } from '../user/user.entity';

export interface Verification {
  token: string;
  expire_at: Date;
  user_id: number;
  user: Stored<User>;
}

export interface VerifyUserValues {
  token: string;
}

export interface ResendVerifyUserValues {
  email: string;
}

export type StoredVerification = Stored<Verification>;
