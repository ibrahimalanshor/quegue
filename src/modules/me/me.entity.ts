import { StoredUser } from '../user/user.entity';

export interface UpdateMeOptions {
  values: {
    name: string;
    username: string;
  };
  user: StoredUser;
}

export interface UpdateEmailOptions {
  values: {
    email: string;
  };
  user: StoredUser;
}
