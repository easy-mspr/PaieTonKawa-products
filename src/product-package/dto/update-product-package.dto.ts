import { IsDecimal, IsInt, IsOptional } from 'class-validator';

export class UpdateProductPackageDto {
  @IsOptional()
  @IsInt()
  productId?: number;

  @IsOptional()
  @IsInt()
  weight?: number;

  @IsOptional()
  @IsDecimal()
  price?: number;
}
