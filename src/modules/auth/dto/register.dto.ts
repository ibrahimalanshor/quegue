import { Expose } from 'class-transformer';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
}
