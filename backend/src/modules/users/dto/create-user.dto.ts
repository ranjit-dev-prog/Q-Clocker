import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { UserRole, EmploymentType } from '../../../common/enums';

export class CreateUserDto {
  @ApiPropertyOptional({ example: 'EMP001', description: 'Internal employee badge / payroll code' })
  @IsOptional()
  @IsString()
  employeeCode?: string;

  @ApiProperty({ example: 'jane.doe@qclocker.io', description: 'Official corporate email' })
  @IsEmail({}, { message: 'Please provide a valid corporate email address' })
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: 'jane.personal@gmail.com', description: 'Personal email address' })
  @IsOptional()
  @IsEmail()
  personalEmail?: string;

  @ApiPropertyOptional({ example: 'P@ssword2026!', description: 'Initial password (min 8 chars, optional if invitation enabled)' })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;

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
  @IsEnum(UserRole)
  roleCode: UserRole;

  @ApiPropertyOptional({ description: 'Department UUID' })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional({ description: 'Team UUID' })
  @IsOptional()
  @IsUUID()
  teamId?: string;

  @ApiPropertyOptional({ description: 'Designation UUID' })
  @IsOptional()
  @IsUUID()
  designationId?: string;

  @ApiPropertyOptional({ description: 'Assigned Reporting Manager UUID' })
  @IsOptional()
  @IsUUID()
  managerId?: string;

  @ApiPropertyOptional({ example: 'Frontend Architect', description: 'Official Job Title' })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional({ enum: EmploymentType, default: EmploymentType.FULL_TIME })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiPropertyOptional({ example: '2026-11-01', description: 'Joining date' })
  @IsOptional()
  @IsDateString()
  joiningDate?: string;

  @ApiPropertyOptional({ example: 'Headquarters', description: 'Work location / office or remote' })
  @IsOptional()
  @IsString()
  workLocation?: string;

  @ApiPropertyOptional({ default: true, description: 'Whether to create an active user login account' })
  @IsOptional()
  @IsBoolean()
  hasLoginAccount?: boolean;

  @ApiPropertyOptional({ default: false, description: 'Send secure email invitation with activation token' })
  @IsOptional()
  @IsBoolean()
  sendInvitation?: boolean;
}
