import { IsString, IsOptional, IsInt, MaxLength, IsDecimal, Min, Max } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  origin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  variety?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  process?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  roastLevel?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  category?: string;

  @IsOptional()
  @IsDecimal()
  @Min(0)
  pricePerKg?: number;
}
