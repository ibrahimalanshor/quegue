import { Expose } from 'class-transformer';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string;
}
