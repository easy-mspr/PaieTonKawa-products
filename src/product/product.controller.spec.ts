import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { ProductPackage } from '../entities/product-package.entity';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { ProductPackageService } from '../product-package/product-package.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;
  let mockProductRepository: any;
  let mockProductPackageRepository: any;
  let mockRabbitMQService: any;
  let mockProductPackageService: any;

  beforeEach(async () => {
    mockProductRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      create: jest.fn(),
      preload: jest.fn(),
      delete: jest.fn(),
    };

    mockProductPackageRepository = {
      save: jest.fn(),
    };

    mockRabbitMQService = {
      sendMessage: jest.fn(),
      subscribeToQueue: jest.fn(),
    };

    mockProductPackageService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(ProductPackage),
          useValue: mockProductPackageRepository,
        },
        {
          provide: RabbitMQService,
          useValue: mockRabbitMQService,
        },
        {
          provide: ProductPackageService,
          useValue: mockProductPackageService,
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), verify: jest.fn() },
        },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  describe('create', () => {
    it('should create a product with correct data', async () => {
      const createProductDto = {
        name: 'Test Product',
        saleType: 'unit',
        description: 'Test Description',
        stock: 100,
        pricePerKg: 20,
        origin: '',
        variety: '',
        process: '',
        roastLevel: '',
        category: '',
        packages: [],
      };
      const result = { ...createProductDto, id: 1 };

      mockProductRepository.create.mockReturnValue(result);
      mockProductRepository.save.mockReturnValue(result);

      const response = await productController.create(createProductDto);

      expect(mockProductRepository.save).toHaveBeenCalledWith(expect.objectContaining(result));
    });

    it('should create associated packages if saleType is packaged', async () => {
      const createProductDto = {
        name: 'Packaged Product',
        saleType: 'packaged',
        description: 'Test Description',
        stock: 100,
        pricePerKg: 20,
        origin: '',
        variety: '',
        process: '',
        roastLevel: '',
        category: '',
        packages: [
          { weight: 250, price: 5 },
          { weight: 500, price: 10 },
        ],
      };
      const productResult = { ...createProductDto, id: 1 };
      const packageResult = createProductDto.packages.map((pkg, index) => ({
        ...pkg,
        id: index + 1,
        productId: 1,
      }));

      mockProductRepository.create.mockReturnValue(productResult);
      mockProductRepository.save.mockReturnValue(productResult);
      mockProductPackageService.create.mockReturnValue(packageResult);

      const response = await productController.create(createProductDto);

      //expect(response).toEqual(productResult);
      expect(mockProductRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Packaged Product',
        saleType: 'packaged',
      }));
      expect(mockProductRepository.save).toHaveBeenCalledWith(expect.objectContaining(productResult));
      expect(mockProductPackageService.create).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a specific product by ID', async () => {
      const result = new Product();
      mockProductRepository.findOne.mockReturnValue(result);

      expect(await productController.findOne("1")).toEqual(result);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['packages'] });
    });

    it('should throw an exception if product is not found', async () => {
      mockProductRepository.findOne.mockReturnValue(null);

      await expect(productController.findOne("1")).rejects.toThrow(NotFoundException);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['packages'] });
    });
  });

  describe('update', () => {
    it('should update the product data', async () => {
      const updateProductDto = { name: 'Updated Product' };
      const result = { ...new Product(), ...updateProductDto };

      mockProductRepository.preload.mockReturnValue(result);
      mockProductRepository.save.mockReturnValue(result);

      expect(await productController.update("1", updateProductDto)).toEqual(result);
      expect(mockProductRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateProductDto,
      });
      expect(mockProductRepository.save).toHaveBeenCalledWith(result);
    });

    it('should throw an exception if product is not found', async () => {
      const updateProductDto = { name: 'Updated Product' };

      mockProductRepository.preload.mockReturnValue(null);

      await expect(productController.update("1", updateProductDto)).rejects.toThrow(NotFoundException);
      expect(mockProductRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateProductDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a product by ID', async () => {
      mockProductRepository.delete.mockReturnValue({ affected: 1 });

      expect(await productController.remove("1")).toEqual(undefined);
      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if product is not found', async () => {
      mockProductRepository.delete.mockReturnValue({ affected: 0 });

      await expect(productController.remove("1")).rejects.toThrow(NotFoundException);
      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
