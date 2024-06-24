import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductPackageService } from './product-package.service';
import { CreateProductPackageDto } from './dto/create-product-package.dto';
import { UpdateProductPackageDto } from './dto/update-product-package.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('product-packages')
@UseGuards(AuthGuard, RolesGuard)
@Controller('product-packages')
export class ProductPackageController {
  constructor(private readonly productPackageService: ProductPackageService) {}

  @Post()
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Create a new product package' })
  @ApiResponse({ status: 201, description: 'The product package has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createProductPackageDto: CreateProductPackageDto) {
    return this.productPackageService.create(createProductPackageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all product packages' })
  @ApiResponse({ status: 200, description: 'Return all product packages.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.productPackageService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product package by id' })
  @ApiResponse({ status: 200, description: 'Return the product package by id.' })
  @ApiResponse({ status: 404, description: 'Product package not found.' })
  findOne(@Param('id') id: string) {
    return this.productPackageService.findOne(+id);
  }

  @Put(':id')
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Update a product package by id' })
  @ApiResponse({ status: 200, description: 'The product package has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Product package not found.' })
  update(@Param('id') id: string, @Body() updateProductPackageDto: UpdateProductPackageDto) {
    return this.productPackageService.update(+id, updateProductPackageDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a product package by id' })
  @ApiResponse({ status: 200, description: 'The product package has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Product package not found.' })
  remove(@Param('id') id: string) {
    return this.productPackageService.remove(+id);
  }

  @Get('/weights/unique')
  @ApiOperation({ summary: 'Get all unique weights of product packages' })
  @ApiResponse({ status: 200, description: 'Return all unique weights of product packages.' })
  findAllUniqueWeights() {
    return this.productPackageService.findAllUniqueWeights();
  }
}
