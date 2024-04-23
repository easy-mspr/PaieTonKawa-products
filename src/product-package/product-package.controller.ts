import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductPackageService } from './product-package.service';
import { CreateProductPackageDto } from './dto/create-product-package.dto';
import { UpdateProductPackageDto } from './dto/update-product-package.dto';

@Controller('product-packages')
export class ProductPackageController {
  constructor(private readonly productPackageService: ProductPackageService) {}

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    create(@Body() createProductPackageDto: CreateProductPackageDto) {
        return this.productPackageService.create(createProductPackageDto);
    }

    @Get()
    findAll() {
        return this.productPackageService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productPackageService.findOne(+id);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    update(@Param('id') id: string, @Body() updateProductPackageDto: UpdateProductPackageDto) {
        return this.productPackageService.update(+id, updateProductPackageDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productPackageService.remove(+id);
    }

    @Get('/weights/unique')
    findAllUniqueWeights() {
        return this.productPackageService.findAllUniqueWeights();
    }
}
