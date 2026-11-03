import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../common/enums';

export class CreateUserDto {
  @ApiProperty({ example: 'jane.doe@qclocker.io', description: 'Employee corporate email' })
  @IsEmail({}, { message: 'Please provide a valid corporate email address' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'P@ssword2026!', description: 'Temporary or initial password (min 8 chars)' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ example: 'Jane', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: '+1-555-0199', description: 'Contact phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: UserRole, example: UserRole.EMPLOYEE, description: 'Role assigned' })
  @IsEnum(UserRole, { message: 'Role must be SUPER_ADMIN, ADMIN, TEAM_LEAD, or EMPLOYEE' })
  roleCode: UserRole;

  @ApiPropertyOptional({ description: 'Department UUID' })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional({ description: 'Team UUID' })
  @IsOptional()
  @IsUUID()
  teamId?: string;

  @ApiPropertyOptional({ description: 'Assigned Manager UUID' })
  @IsOptional()
  @IsUUID()
  managerId?: string;

  @ApiPropertyOptional({ example: 'Frontend Architect', description: 'Official Job Title' })
  @IsOptional()
  @IsString()
  jobTitle?: string;
}
