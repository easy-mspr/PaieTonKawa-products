import { Test, TestingModule } from '@nestjs/testing';
import { ProductPackageService } from './product-package.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductPackage } from '../entities/product-package.entity';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProductPackageService', () => {
  let service: ProductPackageService;
  let productPackageRepository: Repository<ProductPackage>;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const mockProductPackageRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      preload: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const mockProductRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductPackageService,
        {
          provide: getRepositoryToken(ProductPackage),
          useValue: mockProductPackageRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductPackageService>(ProductPackageService);
    productPackageRepository = module.get<Repository<ProductPackage>>(getRepositoryToken(ProductPackage));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  describe('create', () => {
    it('should create a product package with correct data', async () => {
      const createProductPackageDto:ProductPackage = {
          productId: 1,
          weight: 250,
          price: 5,
          id: 0,
          product: new Product
      };
      const productPackage = { ...createProductPackageDto, id: 1 };

      jest.spyOn(productPackageRepository, 'create').mockReturnValue(productPackage);
      jest.spyOn(productPackageRepository, 'save').mockResolvedValue(productPackage);

      expect(await service.create(createProductPackageDto)).toEqual(productPackage);
      expect(productPackageRepository.create).toHaveBeenCalledWith(createProductPackageDto);
      expect(productPackageRepository.save).toHaveBeenCalledWith(productPackage);
    });

    it('should calculate the price correctly if not provided', async () => {
        const createProductPackageDto:ProductPackage = {
            productId: 1,
            weight: 250,
            id: 0,
            price: 0,
            product: new Product
        };
        const product: Product = {
          id: 1,
          pricePerKg: 20,
          createdAt: undefined,
          updatedAt: undefined,
          name: '',
          saleType: 'unit',
          description: '',
          origin: '',
          variety: '',
          process: '',
          roastLevel: '',
          stock: 0,
          category: '',
          packages: [],
        };
        const productPackage: ProductPackage = {
          ...createProductPackageDto,
          price: 5,
          id: 1,
          product: product,
        };
      
        jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
        jest.spyOn(productPackageRepository, 'create').mockReturnValue(productPackage);
        jest.spyOn(productPackageRepository, 'save').mockResolvedValue(productPackage);
      
        const result = await service.create(createProductPackageDto);
      
        expect(result).toEqual(productPackage);
        expect(productRepository.findOne).toHaveBeenCalledWith({ where: { id: createProductPackageDto.productId } });
        expect(productPackageRepository.create).toHaveBeenCalledWith({ ...createProductPackageDto, price: 5 });
        expect(productPackageRepository.save).toHaveBeenCalledWith(productPackage);
      });      
  });

  describe('findAll', () => {
    it('should return all product packages', async () => {
      const productPackages = [new ProductPackage()];
      jest.spyOn(productPackageRepository, 'find').mockResolvedValue(productPackages);

      expect(await service.findAll()).toEqual(productPackages);
      expect(productPackageRepository.find).toHaveBeenCalledWith({ relations: ['product'] });
    });
  });

  describe('findOne', () => {
    it('should return a specific product package by ID', async () => {
      const productPackage = new ProductPackage();
      jest.spyOn(productPackageRepository, 'findOne').mockResolvedValue(productPackage);

      expect(await service.findOne(1)).toEqual(productPackage);
      expect(productPackageRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { product: true },
      });
    });

    it('should throw an exception if product package is not found', async () => {
      jest.spyOn(productPackageRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(productPackageRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { product: true },
      });
    });
  });

  describe('update', () => {
    it('should update the product package data', async () => {
      const updateProductPackageDto = { weight: 500 };
      const productPackage = { ...new ProductPackage(), ...updateProductPackageDto };
      jest.spyOn(productPackageRepository, 'preload').mockResolvedValue(productPackage);
      jest.spyOn(productPackageRepository, 'save').mockResolvedValue(productPackage);

      expect(await service.update(1, updateProductPackageDto)).toEqual(productPackage);
      expect(productPackageRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateProductPackageDto,
      });
      expect(productPackageRepository.save).toHaveBeenCalledWith(productPackage);
    });

    it('should throw an exception if product package is not found', async () => {
      const updateProductPackageDto = { weight: 500 };
      jest.spyOn(productPackageRepository, 'preload').mockResolvedValue(null);

      await expect(service.update(1, updateProductPackageDto)).rejects.toThrow(NotFoundException);
      expect(productPackageRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateProductPackageDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a product package by ID', async () => {
      const deleteResult = { affected: 1, raw: [] };

      jest.spyOn(productPackageRepository, 'delete').mockResolvedValue(deleteResult);

      await service.remove(1);
      expect(productPackageRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if product package is not found', async () => {
      const deleteResult = { affected: 0, raw: [] };

      jest.spyOn(productPackageRepository, 'delete').mockResolvedValue(deleteResult);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      expect(productPackageRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('findAllUniqueWeights', () => {
    it('should return all unique weights of product packages', async () => {
      const productPackages = [{ weight: 250 }, { weight: 500 }];
      const createQueryBuilder: any = {
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(productPackages),
      };

      jest.spyOn(productPackageRepository, 'createQueryBuilder').mockReturnValue(createQueryBuilder);

      expect(await service.findAllUniqueWeights()).toEqual([250, 500]);
      expect(productPackageRepository.createQueryBuilder).toHaveBeenCalledWith('productPackage');
      expect(createQueryBuilder.select).toHaveBeenCalledWith('DISTINCT productPackage.weight', 'weight');
      expect(createQueryBuilder.orderBy).toHaveBeenCalledWith('productPackage.weight', 'ASC');
      expect(createQueryBuilder.getRawMany).toHaveBeenCalled();
    });
  });
});
