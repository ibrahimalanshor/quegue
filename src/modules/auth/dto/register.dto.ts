import { Expose } from 'class-transformer';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsConfirmed } from '../../../../lib/dto/validators/is-confirmed.validator';

export class RegisterDto {
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  username: string;

  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

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
