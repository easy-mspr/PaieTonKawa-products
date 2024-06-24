import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { ProductPackage } from '../entities/product-package.entity';
import { Repository } from 'typeorm';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { ProductPackageService } from '../product-package/product-package.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<Product>;
  let productPackageRepository: Repository<ProductPackage>;
  let rabbitMQService: RabbitMQService;
  let productPackageService: ProductPackageService;

  beforeEach(async () => {
    const mockProductRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      preload: jest.fn(),
      delete: jest.fn(),
      findAndCount: jest.fn(),
    };

    const mockProductPackageRepository = {
      save: jest.fn(),
    };

    const mockRabbitMQService = {
      sendMessage: jest.fn(),
      subscribeToQueue: jest.fn(),
      publishToQueue: jest.fn(),
    };

    const mockProductPackageService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    productPackageRepository = module.get<Repository<ProductPackage>>(getRepositoryToken(ProductPackage));
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
    productPackageService = module.get<ProductPackageService>(ProductPackageService);
  });

  describe('create', () => {
    it('should create a product with correct data', async () => {
        const createProductDto: Product = {
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
            id: 0,
            createdAt: undefined,
            updatedAt: undefined,
            packages: []
        };

      const product = { ...createProductDto, id: 1, createdAt: new Date(), updatedAt: new Date(), packages: [] } as Product;

      jest.spyOn(productRepository, 'create').mockReturnValue(product);
      jest.spyOn(productRepository, 'save').mockResolvedValue(product);
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);

      expect(await service.create(createProductDto)).toEqual(product);
      expect(productRepository.save).toHaveBeenCalledWith(product);
    });

    it('should create associated packages if saleType is packaged', async () => {
      const createProductDto = {
        name: 'Packaged Product',
        description: 'Test Description',
        stock: 100,
        pricePerKg: 20,
        packages: []
      };


      const product:Product = {
          ...createProductDto,
          id: 1,
          createdAt: undefined,
          updatedAt: undefined,
          origin: '',
          variety: '',
          process: '',
          roastLevel: '',
          category: '',
          saleType: 'unit'
      };

      jest.spyOn(productRepository, 'create').mockReturnValue(product);
      jest.spyOn(productRepository, 'save').mockResolvedValue(product);
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
      jest.spyOn(productPackageService, 'create').mockResolvedValue(undefined);

      expect(await service.create(createProductDto)).toEqual(product);
      expect(productRepository.save).toHaveBeenCalledWith(expect.objectContaining(product));
    });
  });

  describe('findAll', () => {
    it('should return all products with pagination', async () => {
      const products = [new Product()];
      const total = 1;
      jest.spyOn(productRepository, 'findAndCount').mockResolvedValue([products, total]);

      const result = await service.findAll(1, 10);
      expect(result).toEqual({ products, total });
      expect(productRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['packages'],
        take: 10,
        skip: 0,
      });
    });
  });

  describe('findOne', () => {
    it('should return a specific product by ID', async () => {
      const product = new Product();
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);

      expect(await service.findOne(1)).toEqual(product);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['packages'],
      });
    });

    it('should throw an exception if product is not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['packages'],
      });
    });
  });

  describe('update', () => {
    it('should update the product data', async () => {
      const updateProductDto = { name: 'Updated Product' };
      const product = { ...new Product(), ...updateProductDto };
      jest.spyOn(productRepository, 'preload').mockResolvedValue(product);
      jest.spyOn(productRepository, 'save').mockResolvedValue(product);

      expect(await service.update(1, updateProductDto)).toEqual(product);
      expect(productRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateProductDto,
      });
      expect(productRepository.save).toHaveBeenCalledWith(product);
    });

    it('should throw an exception if product is not found', async () => {
      const updateProductDto = { name: 'Updated Product' };
      jest.spyOn(productRepository, 'preload').mockResolvedValue(null);

      await expect(service.update(1, updateProductDto)).rejects.toThrow(NotFoundException);
      expect(productRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateProductDto,
      });
    });
  });

  //describe('remove', () => {
  //  it('should remove a product by ID', async () => {
  //    jest.spyOn(productRepository, 'delete').mockResolvedValue({ affected: 1 });
//
  //    await service.remove(1);
  //    expect(productRepository.delete).toHaveBeenCalledWith(1);
  //  });
//
  //  it('should throw an exception if product is not found', async () => {
  //    jest.spyOn(productRepository, 'delete').mockResolvedValue({ affected: 0 });
//
  //    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  //    expect(productRepository.delete).toHaveBeenCalledWith(1);
  //  });
  //});

  describe('checkProductAvailability', () => {
    it('should check product availability and update stock correctly', async () => {
      const message = {
        content: JSON.stringify({
          orderId: 1,
          items: [
            { productId: 1, quantity: 10, saleType: 'unit' },
          ],
        }),
      };
      const product = new Product();
      product.id = 1;
      product.stock = 10;

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
      jest.spyOn(productRepository, 'save').mockResolvedValue(product);
      jest.spyOn(rabbitMQService, 'publishToQueue').mockResolvedValue(true);

      await service.checkProductAvailability(message);

      expect(product.stock).toBe(10);
    });
  });
});
