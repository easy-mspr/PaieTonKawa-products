import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

class CreateProductPackageDto {
  @ApiProperty({ example: 500, description: 'Weight of the product package in grams' })
  @IsInt()
  @IsNotEmpty()
  weight: number;

  @ApiProperty({ example: 15.99, description: 'Price of the product package', required: false })
  @IsOptional()
  @IsNumber()
  price: number;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Coffee', description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'A premium coffee', description: 'Description of the product', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiProperty({ example: 'Colombia', description: 'Origin of the product', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  origin?: string;

  @ApiProperty({ example: 'Arabica', description: 'Variety of the product', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  variety?: string;

  @ApiProperty({ example: 'Washed', description: 'Process of the product', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  process?: string;

  @ApiProperty({ example: 'Medium', description: 'Roast level of the product', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  roastLevel?: string;

  @ApiProperty({ example: 100, description: 'Stock quantity of the product' })
  @IsInt()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({ example: 'Beverages', description: 'Category of the product', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  category?: string;

  @ApiProperty({ example: 15.50, description: 'Price per kilogram of the product' })
  @IsNumber()
  @IsNotEmpty()
  pricePerKg: number;

  @ApiProperty({ example: 'packaged', description: 'Sale type of the product', enum: ['packaged', 'unit'], default: 'packaged' })
  @IsString()
  @IsNotEmpty()
  saleType: 'packaged' | 'unit' = 'packaged';

  @ApiProperty({ type: [CreateProductPackageDto], description: 'List of product packages' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductPackageDto)
  packages: CreateProductPackageDto[];
}