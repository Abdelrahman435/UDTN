import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { Product } from './product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../guards/auth.guard';

describe('ProductsService', () => {
  let service: ProductsService;
  let jwtService: JwtService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Product),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(), // Mocking the remove method
          },
        },
        AuthGuard,
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jwtService = module.get<JwtService>(JwtService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    const createProductDto: CreateProductDto = {
      name: 'Product A',
      description: 'Description of Product A',
      price: 100,
      stock: 20,
    };

    const product = new Product();
    product.id = 1;
    product.name = 'Product A';
    product.description = 'Description of Product A';
    product.price = 100;
    product.stock = 20;

    jest.spyOn(repository, 'create').mockReturnValue(product);
    jest.spyOn(repository, 'save').mockResolvedValue(product);

    const result = await service.create(createProductDto);

    expect(result).toEqual(product);
  });

  it('should find all products', async () => {
    const products: Product[] = [
      {
        id: 1,
        name: 'Product A',
        description: 'Description A',
        price: 100,
        stock: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Product B',
        description: 'Description B',
        price: 150,
        stock: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(products);

    const result = await service.find();
    expect(result).toEqual(products);
  });

  it('should find a single product by id', async () => {
    const product: Product = {
      id: 1,
      name: 'Product A',
      description: 'Description A',
      price: 100,
      stock: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(product);

    const result = await service.findOne(1);
    expect(result).toEqual(product);
  });

  it('should update a product', async () => {
    const product: Product = {
      id: 1,
      name: 'Product A',
      description: 'Description A',
      price: 100,
      stock: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedProduct: Product = {
      id: 1,
      name: 'Product A Updated',
      description: 'Description A Updated',
      price: 120,
      stock: 30,
      createdAt: product.createdAt,
      updatedAt: new Date(),
    };

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(product);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedProduct);

    const result = await service.update(1, {
      name: 'Product A Updated',
      description: 'Description A Updated',
      price: 120,
      stock: 30,
    });
    expect(result).toEqual(updatedProduct);
  });

  it('should delete a product', async () => {
    const product = new Product();
    product.id = 1;

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(product);
    jest.spyOn(repository, 'remove').mockResolvedValue(undefined); // Mock remove method

    const result = await service.remove(1);
    expect(result).toBeUndefined();
  });
});
