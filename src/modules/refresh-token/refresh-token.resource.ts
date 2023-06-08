import { ResourceModel, createResource } from '../../../lib/resource/resource';
import { RefreshToken } from './refresh-token.entity';

export class RefreshTokenModel extends ResourceModel {
  table: string = 'refresh_tokens';
  fillable: string[] = ['token', 'user_id'];
  selectable: string[] = [
    'id',
    'token',
    'user_id',
    'deleted_at',
    'created_at',
    'updated_at',
  ];
}

export const refreshTokenResource = createResource<
  RefreshToken,
  {
    token: string;
    user_id: number;
  }
>(new RefreshTokenModel());
