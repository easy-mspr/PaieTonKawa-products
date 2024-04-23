import { Type } from 'class-transformer';
import { IsArray, IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

class CreateProductPackageDto {
  @IsInt()
  @IsNotEmpty()
  weight: number;

  @IsOptional()
  @IsNumber()
  price: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  origin?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  variety?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  process?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  roastLevel?: string;

  @IsInt()
  @IsNotEmpty()
  stock: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  category?: string;

  @IsNumber()
  @IsNotEmpty()
  pricePerKg: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductPackageDto)
  packages: CreateProductPackageDto[];
}
