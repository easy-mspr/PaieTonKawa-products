import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsInt, IsOptional } from 'class-validator';

export class UpdateProductPackageDto {
  @ApiProperty({ example: 1, description: 'ID of the associated product', required: false })
  @IsOptional()
  @IsInt()
  productId?: number;

  @ApiProperty({ example: 500, description: 'Weight of the product package in grams', required: false })
  @IsOptional()
  @IsInt()
  weight?: number;

  @ApiProperty({ example: 15.99, description: 'Price of the product package', required: false })
  @IsOptional()
  @IsDecimal()
  price?: number;
}
