import {
  IsString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
  Max,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@/database/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique login for the user',
    example: 'john_doe',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @Length(3, 50)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Login can only contain letters, numbers, and underscores',
  })
  login: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  lastName: string;

  @ApiPropertyOptional({
    description: 'Middle name of the user',
    example: 'Michael',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  middleName?: string;

  @ApiProperty({
    description: 'Gender of the user',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'Age of the user',
    example: 25,
    minimum: 0,
    maximum: 150,
  })
  @IsInt()
  @Min(0)
  @Max(150)
  age: number;

  @ApiPropertyOptional({
    description: 'Phone number of the user',
    example: '+1234567890',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(10, 20)
  @Matches(/^[\+]?[0-9\s\-\(\)]+$/, {
    message:
      'Phone number must contain only digits, spaces, hyphens, parentheses, and optionally a plus sign',
  })
  phone?: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Avatar URL or path',
    example: 'https://example.com/avatar.jpg',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  avatar?: string;
}
