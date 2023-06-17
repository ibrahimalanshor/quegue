import { Expose } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmailDto {
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  email: string;
}
