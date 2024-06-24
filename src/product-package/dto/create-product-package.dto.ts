import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductPackageDto {
  @ApiProperty({ example: 1, description: 'ID of the associated product' })
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @ApiProperty({ example: 500, description: 'Weight of the product package in grams' })
  @IsNotEmpty()
  @IsInt()
  weight: number;

  @ApiProperty({ example: 15.99, description: 'Price of the product package', required: false })
  @IsOptional()
  @IsDecimal()
  price: number;
}
