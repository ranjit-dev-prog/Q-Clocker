import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { UserRole } from '../../../common/enums';

export class RegisterDto {
  @ApiProperty({ example: 'employee@qclocker.io', description: 'User corporate email' })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecretP@ss2026!', description: 'User password (min 8 chars)' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ example: 'David', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Ross', description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: '+1-555-0103', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'EMPLOYEE', enum: UserRole, description: 'Role assigned to user' })
  @IsOptional()
  @IsString()
  roleCode?: string;

  @ApiPropertyOptional({ description: 'Department UUID' })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional({ description: 'Team UUID' })
  @IsOptional()
  @IsUUID()
  teamId?: string;

  @ApiPropertyOptional({ description: 'Manager user UUID' })
  @IsOptional()
  @IsUUID()
  managerId?: string;

  @ApiPropertyOptional({ example: 'Full-Stack Software Engineer', description: 'Job title' })
  @IsOptional()
  @IsString()
  jobTitle?: string;
}

