import { Stored } from '../../../lib/entity/types';
import { User } from '../user/user.entity';

export interface VerificationToken {
  token: String;
  user: Stored<User>;
}

export type StoredVerificationToken = Stored<VerificationToken>;
