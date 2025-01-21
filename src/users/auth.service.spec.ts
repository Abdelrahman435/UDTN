import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { promisify } from 'util';
import * as crypto from 'crypto';

const scryptAsync = promisify(crypto.scrypt);

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const fakeUsersService: Partial<UsersService> = {
      find: jest.fn().mockResolvedValue([]), // Default mock for `find`
      create: jest.fn().mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'salt.hash',
      }),
    };

    const fakeJwtService: Partial<JwtService> = {
      sign: jest.fn().mockReturnValue('mockedToken'),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: JwtService,
          useValue: fakeJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const result = await service.signup('test@example.com', 'password');
    expect(result).toHaveProperty('token', 'mockedToken');
  });

  it('throws an error if user signs up with an email that is already in use', async () => {
    service['usersService'].find = jest
      .fn()
      .mockResolvedValue([
        { id: 1, email: 'test@example.com', password: 'existing.hash' } as User,
      ]);

    await expect(
      service.signup('test@example.com', 'password'),
    ).rejects.toThrowError(new BadRequestException('Email already exists'));
  });

  it('throws an error if user login fails due to invalid email', async () => {
    service['usersService'].find = jest.fn().mockResolvedValue([]);

    await expect(
      service.signin('invalid@example.com', 'password'),
    ).rejects.toThrowError(new UnauthorizedException('Invalid credentials'));
  });

  it('throws an error if user login fails due to incorrect password', async () => {
    service['usersService'].find = jest.fn().mockResolvedValue([
      {
        id: 1,
        email: 'test@example.com',
        password: 'salt.correcthash',
      } as User,
    ]);

    service['hashPassword'] = jest.fn().mockReturnValue('wrong.hash');

    await expect(
      service.signin('test@example.com', 'wrongPassword'),
    ).rejects.toThrowError(new UnauthorizedException('Invalid credentials'));
  });

  it('returns a JWT token on successful login', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'salt.correcthash', 
    };

    service['usersService'].find = jest.fn().mockResolvedValue([mockUser]);

    jest
      .spyOn(crypto, 'scrypt')
      .mockImplementation(
        (
          password: crypto.BinaryLike,
          salt: crypto.BinaryLike,
          keylen: number,
          optionsOrCallback:
            | crypto.ScryptOptions
            | ((err: Error | null, derivedKey: Buffer) => void),
          maybeCallback?: (err: Error | null, derivedKey: Buffer) => void,
        ) => {
          const callback =
            typeof optionsOrCallback === 'function'
              ? optionsOrCallback
              : maybeCallback;

          const expectedHash = Buffer.from('correcthash', 'hex');
          callback!(null, expectedHash);
        },
      );

    service['generateToken'] = jest.fn().mockReturnValue('mockedToken');

    const result = await service.signin('test@example.com', 'password');

    expect(result).toEqual({
      user: mockUser,
      token: 'mockedToken',
    });
    expect(service['generateToken']).toHaveBeenCalledWith(mockUser);
  });
});
