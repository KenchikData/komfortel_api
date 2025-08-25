import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User, Gender, UserStatus } from '@/database/entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    login: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Michael',
    gender: Gender.MALE,
    age: 30,
    phone: '+1234567890',
    email: 'john.doe@example.com',
    avatar: 'https://example.com/avatar.jpg',
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    get initials() {
      return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`;
    },
  };

  const mockCreateUserDto: CreateUserDto = {
    login: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Michael',
    gender: Gender.MALE,
    age: 30,
    phone: '+1234567890',
    email: 'john.doe@example.com',
    avatar: 'https://example.com/avatar.jpg',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            findByLogin: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            existsByEmail: jest.fn(),
            existsByLogin: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      jest.spyOn(repository, 'existsByEmail').mockResolvedValue(false);
      jest.spyOn(repository, 'existsByLogin').mockResolvedValue(false);
      jest.spyOn(repository, 'create').mockResolvedValue(mockUser);

      const result = await service.create(mockCreateUserDto);

      expect(result).toEqual({
        id: mockUser.id,
        login: mockUser.login,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        middleName: mockUser.middleName,
        fullName: mockUser.fullName,
        initials: mockUser.initials,
        gender: mockUser.gender,
        age: mockUser.age,
        phone: mockUser.phone,
        email: mockUser.email,
        avatar: mockUser.avatar,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
        status: mockUser.status,
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      jest.spyOn(repository, 'existsByEmail').mockResolvedValue(true);

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if login already exists', async () => {
      jest.spyOn(repository, 'existsByEmail').mockResolvedValue(false);
      jest.spyOn(repository, 'existsByLogin').mockResolvedValue(true);

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException for invalid age', async () => {
      const invalidUserDto = { ...mockCreateUserDto, age: -1 };

      await expect(service.create(invalidUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(mockUser);

      const result = await service.findById(mockUser.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockUser.id);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      jest.spyOn(repository, 'findAll').mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockUser.id);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateDto: UpdateUserDto = { firstName: 'Jane' };
      const updatedUser = {
        ...mockUser,
        firstName: 'Jane',
        get fullName() {
          return `${this.firstName} ${this.lastName}`;
        },
        get initials() {
          return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`;
        },
      };

      jest.spyOn(repository, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(repository, 'existsByEmail').mockResolvedValue(false);
      jest.spyOn(repository, 'existsByLogin').mockResolvedValue(false);
      jest.spyOn(repository, 'update').mockResolvedValue(updatedUser);

      const result = await service.update(mockUser.id, updateDto);

      expect(result.firstName).toBe('Jane');
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      await expect(service.update('non-existent-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(true);

      await expect(service.delete(mockUser.id)).resolves.not.toThrow();
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(false);

      await expect(service.delete('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
