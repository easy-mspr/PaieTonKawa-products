import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductPackage } from 'src/entities/product-package.entity';
import { CreateProductPackageDto } from './dto/create-product-package.dto';
import { UpdateProductPackageDto } from './dto/update-product-package.dto';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class ProductPackageService {
  constructor(
    @InjectRepository(ProductPackage)
    private readonly productPackageRepository: Repository<ProductPackage>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductPackageDto: CreateProductPackageDto): Promise<ProductPackage> {

    if (!createProductPackageDto.price) {
      const product = await this.productRepository.findOne({
        where: { id : createProductPackageDto.productId },
      });

      createProductPackageDto.price = createProductPackageDto.weight * product.pricePerKg / 1000
    }

    const productPackage = this.productPackageRepository.create(createProductPackageDto);
    return this.productPackageRepository.save(productPackage);
  }

  async findAll(): Promise<ProductPackage[]> {
    return this.productPackageRepository.find({ relations: ['product'] });
  }

  async findOne(id: number): Promise<ProductPackage> {
    const productPackage = await this.productPackageRepository.findOne({
        where: { id },
        relations: { product: true },
      });
    if (!productPackage) {
      throw new NotFoundException(`ProductPackage with ID "${id}" not found`);
    }
    return productPackage;
  }

  async update(id: number, updateProductPackageDto: UpdateProductPackageDto): Promise<ProductPackage> {
    const productPackage = await this.productPackageRepository.preload({
      id: +id,
      ...updateProductPackageDto,
    });
    if (!productPackage) {
      throw new NotFoundException(`ProductPackage with ID "${id}" not found`);
    }
    return this.productPackageRepository.save(productPackage);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productPackageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`ProductPackage with ID "${id}" not found`);
    }
  }

  async findAllUniqueWeights(): Promise<number[]> {
    const productPackages = await this.productPackageRepository.createQueryBuilder('productPackage')
      .select('DISTINCT productPackage.weight', 'weight')
      .orderBy('productPackage.weight', 'ASC')
      .getRawMany();
  
    return productPackages.map(pp => pp.weight);
  }
}
