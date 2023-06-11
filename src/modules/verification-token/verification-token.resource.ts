import { ResourceModel, createResource } from '../../../lib/resource/resource';
import { VerificationToken } from './verification-token.entity';

export class VerificationTokenModel extends ResourceModel {
  table: string = 'verification_tokens';
  fillable: string[] = ['token', 'user_id', 'expire_at'];
  selectable: string[] = ['id', 'token', 'user_id', 'created_at', 'updated_at'];
}

export const verificationTokenResource = createResource<VerificationToken>(
  new VerificationTokenModel()
);
