import { Expose } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthDto {
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  access_token: string;

  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  id_token: string;
}
