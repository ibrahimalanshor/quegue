import { Stored } from '../../../lib/entity/types';
import { User } from '../user/user.entity';

export interface ResetPassword {
  token: string;
  expire_at: Date;
  user_id: number;
  user: Stored<User>;
}

export type StoredResetPassword = Stored<ResetPassword>;

export interface ForgotPasswordValues {
  email: string;
}
