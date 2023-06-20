import { createResource } from '../../../lib/resource/resource';
import { ResourceModel } from '../../../lib/resource/resource.model';
import { createAuthMiddleware } from '../auth/middlewares/auth.middleware';
import { User } from './user.entity';

export class UserModel extends ResourceModel {
  table: string = 'users';
  fillable: string[] = ['username', 'email', 'name', 'password'];
  selectable: string[] = [
    'id',
    'name',
    'email',
    'username',
    'password',
    'verified_at',
    'deleted_at',
    'created_at',
    'updated_at',
  ];
  hidden: string[] = ['password'];
}

export const userResource = createResource<User>(new UserModel(), {
  routerConfig: {
    middleware: [createAuthMiddleware()],
  },
});
