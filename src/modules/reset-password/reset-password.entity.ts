import { Stored } from '../../../lib/entity/entity.type';
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

export interface ResetPasswordValues {
  token: string;
  password: string;
}
