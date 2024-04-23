import { IsDecimal, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateProductPackageDto {
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsInt()
  weight: number;

  @IsOptional()
  @IsDecimal()
  price: number;
}
