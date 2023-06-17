import { Expose } from 'class-transformer';
import { IsDefined, IsString, IsNotEmpty } from 'class-validator';
import { IsConfirmed } from '../../../../lib/dto/validators/is-confirmed.validator';

export class ResetPasswordDto {
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  token: string;

  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsConfirmed('password')
  password_confirmation: string;
}
