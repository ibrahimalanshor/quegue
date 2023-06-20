import { createResource } from '../../../lib/resource/resource';
import { ResourceModel } from '../../../lib/resource/resource.model';
import { ResetPassword } from './reset-password.entity';

export class ResetPasswordModel extends ResourceModel {
  table: string = 'reset_passwords';
  fillable: string[] = ['token', 'user_id', 'expire_at'];
  selectable: string[] = ['id', 'token', 'user_id', 'created_at', 'updated_at'];
  hidden: string[] = [];
}

export const resetPasswordResource = createResource<ResetPassword>(
  new ResetPasswordModel()
);
