import { Expose } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class RefreshTokenDto {
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsJWT()
  token: string;
}
