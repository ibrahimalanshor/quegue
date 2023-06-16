import { Expose } from 'class-transformer';
import { IsDefined, IsString, IsNotEmpty } from 'class-validator';

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
}
