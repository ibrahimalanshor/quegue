import { Expose } from 'class-transformer';
import { IsOptional, IsObject, IsNotEmpty } from 'class-validator';

export class ResourceRowQueryDto {
  @Expose()
  @IsOptional()
  @IsObject()
  @IsNotEmpty()
  columns: object;
}
