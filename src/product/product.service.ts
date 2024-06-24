import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductPackage } from 'src/entities/product-package.entity';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { ProductPackageService } from 'src/product-package/product-package.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductPackage)
    private readonly productPackageRepository: Repository<ProductPackage>,
    private rabbitMQService: RabbitMQService,
    private productPackageService : ProductPackageService
  ) {
    
    this.rabbitMQService.subscribeToQueue('orders_to_products_check_availability', (message) => this.checkProductAvailability(message));
  }

  async checkProductAvailability(message) {
    const content = message.content.toString();
    const { orderId, items } = JSON.parse(content);
  
    const availableItems = [];
    let creationPossible = true;
  
    try {
      for (const item of items) {
        const product = await this.productRepository.findOne({ where: { id: item.productId }, relations: ['packages'] });
  
        if (product) {
          if (product.saleType === 'unit') {
            if (product.stock >= item.quantity) {
              product.stock -= item.quantity;
              availableItems.push({ ...item, pricePerUnit: product.pricePerKg });
              await this.productRepository.save(product);
            }
          } else if (product.saleType === 'packaged') {
            const productPackage = product.packages.find(p => p.id.toString() === item.productPackageId);
            if (productPackage) {
              const totalWeight = item.quantity * productPackage.weight;
              if (product.stock >= totalWeight) {
                product.stock -= totalWeight;
                availableItems.push({ ...item, packageWeight: productPackage.weight, price: productPackage.price });
                await this.productRepository.save(product); 
              }
            }
          }
        }
      }
  
      if (availableItems.length === 0) {
        creationPossible = false;
      }
  
      const response = {
        orderId,
        items: availableItems,
        creationPossible
      };
  
      await this.rabbitMQService.publishToQueue('products_to_orders_availability_response', response);
    } catch (error) {
      console.error('Erreur lors du traitement de la vérification de la disponibilité:', error);
    }
  }
  

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { packages, ...productData } = createProductDto;

    const product = this.productRepository.create(productData);
    await this.productRepository.save(product);

    if (product.saleType == 'packaged' && packages && packages.length > 0) {
      for (const packageData of packages) {
        await this.productPackageService.create({
          ...packageData,
          productId: product.id,
        })
      }
    }

    return await this.productRepository.findOne({ where: { id: product.id }, relations: ['packages'] });
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ products: Product[], total: number }> {
    const [products, total] = await this.productRepository.findAndCount({
      relations: ['packages'],
      take: limit,
      skip: (page - 1) * limit,
    });
    return { products, total };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['packages'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.preload({
      id: +id,
      ...updateProductDto,
    });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
}
