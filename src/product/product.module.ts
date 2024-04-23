import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from 'src/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPackage } from 'src/entities/product-package.entity';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';
import { ProductPackageModule } from 'src/product-package/product-package.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), TypeOrmModule.forFeature([ProductPackage]), RabbitMQModule, ProductPackageModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
