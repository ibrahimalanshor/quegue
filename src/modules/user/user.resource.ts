import { createResource } from '../../../lib/resource/resource';
import { ResourceModel } from '../../../lib/resource/resource.model';
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
}

export const userResource = createResource<User>(new UserModel());
