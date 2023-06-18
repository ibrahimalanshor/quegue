import { Expose } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { IsConfirmed } from '../../../../lib/dto/validators/is-confirmed.validator';

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

  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Expose()
  @ValidateIf((o) => !!o.password)
  @IsNotEmpty()
  @IsString()
  @IsConfirmed('password')
  password_confirmation: string;
}
