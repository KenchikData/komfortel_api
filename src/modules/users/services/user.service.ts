import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { User, UserStatus } from '@/database/entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user with same email already exists
    const existingEmail = await this.userRepository.existsByEmail(
      createUserDto.email,
    );
    if (existingEmail) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if user with same login already exists
    const existingLogin = await this.userRepository.existsByLogin(
      createUserDto.login,
    );
    if (existingLogin) {
      throw new ConflictException('User with this login already exists');
    }

    // Validate age
    if (createUserDto.age < 0 || createUserDto.age > 150) {
      throw new BadRequestException('Age must be between 0 and 150');
    }

    const user = await this.userRepository.create(createUserDto);
    return this.mapToResponseDto(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => this.mapToResponseDto(user));
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToResponseDto(user);
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return this.mapToResponseDto(user);
  }

  async findByLogin(login: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByLogin(login);
    if (!user) {
      throw new NotFoundException(`User with login ${login} not found`);
    }
    return this.mapToResponseDto(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // Check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being updated and if it conflicts with existing user
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.userRepository.existsByEmail(
        updateUserDto.email,
      );
      if (emailExists) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Check if login is being updated and if it conflicts with existing user
    if (updateUserDto.login && updateUserDto.login !== existingUser.login) {
      const loginExists = await this.userRepository.existsByLogin(
        updateUserDto.login,
      );
      if (loginExists) {
        throw new ConflictException('User with this login already exists');
      }
    }

    // Validate age if being updated
    if (
      updateUserDto.age !== undefined &&
      (updateUserDto.age < 0 || updateUserDto.age > 150)
    ) {
      throw new BadRequestException('Age must be between 0 and 150');
    }

    const updatedUser = await this.userRepository.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.mapToResponseDto(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async updateStatus(id: string, status: UserStatus): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.userRepository.update(id, {
      status,
    } as UpdateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.mapToResponseDto(updatedUser);
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      fullName: user.fullName,
      initials: user.initials,
      gender: user.gender,
      age: user.age,
      phone: user.phone,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      status: user.status,
    };
  }
}
