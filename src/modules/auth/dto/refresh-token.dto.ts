import { Expose } from 'class-transformer';
import { IsDefined, IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsJWT()
  token: string;
}
