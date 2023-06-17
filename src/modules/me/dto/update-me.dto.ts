import { Expose } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class UpdateMeDto {
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
}
