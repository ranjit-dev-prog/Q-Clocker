import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';

export enum EmploymentStatus {
  ACTIVE = 'ACTIVE',
  PROBATION = 'PROBATION',
  ON_LEAVE = 'ON_LEAVE',
  NOTICE_PERIOD = 'NOTICE_PERIOD',
  RESIGNED = 'RESIGNED',
  TERMINATED = 'TERMINATED',
  ARCHIVED = 'ARCHIVED',
}

export class CreateHrmsEmployeeDto {
  @ApiProperty({ example: 'David' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Ross' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'david.ross@qclocker.io' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'david.personal@gmail.com' })
  @IsEmail()
  @IsOptional()
  personalEmail?: string;

  @ApiPropertyOptional({ example: '+1-555-0144' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '10000000-0000-0000-0000-000000000001' })
  @IsString()
  @IsNotEmpty()
  departmentId: string;

  @ApiPropertyOptional({ example: '30000000-0000-0000-0000-000000000001' })
  @IsString()
  @IsOptional()
  designationId?: string;

  @ApiPropertyOptional({ example: '00000000-0000-0000-0000-000000000001' })
  @IsString()
  @IsOptional()
  managerId?: string;

  @ApiPropertyOptional({ example: 'Senior Software Engineer' })
  @IsString()
  @IsOptional()
  jobTitle?: string;

  @ApiPropertyOptional({ example: 'FULL_TIME' })
  @IsString()
  @IsOptional()
  employmentType?: string;

  @ApiPropertyOptional({ example: '2026-11-01' })
  @IsDateString()
  @IsOptional()
  joiningDate?: string;

  @ApiPropertyOptional({ example: 'Headquarters' })
  @IsString()
  @IsOptional()
  workLocation?: string;

  @ApiPropertyOptional({ enum: EmploymentStatus, default: EmploymentStatus.ACTIVE })
  @IsEnum(EmploymentStatus)
  @IsOptional()
  status?: EmploymentStatus;

  @ApiPropertyOptional({ example: 'EMPLOYEE' })
  @IsString()
  @IsOptional()
  roleCode?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  hasLoginAccount?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  initialPassword?: string;
}

export class UpdateHrmsEmployeeDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  personalEmail?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  designationId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  managerId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  jobTitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  workLocation?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ enum: EmploymentStatus })
  @IsEnum(EmploymentStatus)
  @IsOptional()
  status?: EmploymentStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  changeReason?: string;
}

export class UpdateEmployeeStatusDto {
  @ApiProperty({ enum: EmploymentStatus })
  @IsEnum(EmploymentStatus)
  @IsNotEmpty()
  status: EmploymentStatus;

  @ApiProperty({ example: 'Employee successfully passed 90-day probationary evaluation.' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  effectiveDate?: string;
}

export class HrmsEmployeeQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  designationId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  managerId?: string;

  @ApiPropertyOptional({ enum: EmploymentStatus })
  @IsEnum(EmploymentStatus)
  @IsOptional()
  status?: EmploymentStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  limit?: number;
}
