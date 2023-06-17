import { ResourceModel, createResource } from '../../../lib/resource/resource';
import { RefreshToken } from './refresh-token.entity';

export class RefreshTokenModel extends ResourceModel {
  table: string = 'refresh_tokens';
  fillable: string[] = ['token', 'user_id', 'expire_at'];
  selectable: string[] = ['id', 'token', 'user_id', 'created_at', 'updated_at'];
}

export const refreshTokenResource = createResource<RefreshToken>(
  new RefreshTokenModel()
);
