import { Module } from '@nestjs/common';
import { ProductPackageService } from './product-package.service';
import { ProductPackageController } from './product-package.controller';
import { ProductPackage } from 'src/entities/product-package.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductPackage]), TypeOrmModule.forFeature([Product])],
  providers: [ProductPackageService],
  controllers: [ProductPackageController],
  exports: [ProductPackageService]
})
export class ProductPackageModule {}
