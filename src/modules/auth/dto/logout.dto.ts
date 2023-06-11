import { Expose } from 'class-transformer';
import { IsDefined, IsJWT, IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsJWT()
  token: string;
}
