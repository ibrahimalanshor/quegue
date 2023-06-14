import { Expose } from 'class-transformer';
import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class ResendVerificationDto {
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
