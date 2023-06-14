import { ResourceModel, createResource } from '../../../lib/resource/resource';
import { Verification } from './verification.entity';

export class VerificationModel extends ResourceModel {
  table: string = 'verifications';
  fillable: string[] = ['token', 'user_id', 'expire_at'];
  selectable: string[] = ['id', 'token', 'user_id', 'created_at', 'updated_at'];
}

export const verificationResource = createResource<Verification>(
  new VerificationModel()
);
