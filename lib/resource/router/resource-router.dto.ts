import { Expose } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ResourcePage {
  @Expose()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  size: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  number: number;
}

export class ResourceQuery {
  @Expose()
  @ValidateNested()
  page: ResourcePage;

  @Expose()
  @IsOptional()
  @IsObject()
  @IsNotEmpty()
  columns: object;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sort: string;
}
