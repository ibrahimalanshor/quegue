import { ResourceModel, createResource } from '../../../lib/resource/resource';
import { ResetPassword } from './reset-password.entity';

export class ResetPasswordModel extends ResourceModel {
  table: string = 'reset_passwords';
  fillable: string[] = ['token', 'user_id', 'expire_at'];
  selectable: string[] = ['id', 'token', 'user_id', 'created_at', 'updated_at'];
}

export const resetPasswordResource = createResource<ResetPassword>(
  new ResetPasswordModel()
);
