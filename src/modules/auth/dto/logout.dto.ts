import { Expose } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class LogoutDto {
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsJWT()
  token: string;
}
