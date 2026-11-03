import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID, IsEmail, IsDateString } from 'class-validator';
import { UserRole, EmploymentType, AccountStatus } from '../../../common/enums';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'EMP001', description: 'Employee badge code' })
  @IsOptional()
  @IsString()
  employeeCode?: string;

  @ApiPropertyOptional({ example: 'Jane', description: 'First name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'jane.personal@gmail.com' })
  @IsOptional()
  @IsEmail()
  personalEmail?: string;

  @ApiPropertyOptional({ example: '+1-555-0199', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.TEAM_LEAD, description: 'Role assigned' })
  @IsOptional()
  @IsEnum(UserRole)
  roleCode?: UserRole;

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

  @ApiPropertyOptional({ description: 'Assigned Manager UUID' })
  @IsOptional()
  @IsUUID()
  managerId?: string;

  @ApiPropertyOptional({ example: 'Lead Software Architect', description: 'Job Title' })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional({ enum: EmploymentType })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiPropertyOptional({ example: '2026-11-01' })
  @IsOptional()
  @IsDateString()
  joiningDate?: string;

  @ApiPropertyOptional({ example: 'Headquarters' })
  @IsOptional()
  @IsString()
  workLocation?: string;

  @ApiPropertyOptional({ example: true, description: 'Login account enabled' })
  @IsOptional()
  @IsBoolean()
  hasLoginAccount?: boolean;

  @ApiPropertyOptional({ enum: AccountStatus })
  @IsOptional()
  @IsEnum(AccountStatus)
  accountStatus?: AccountStatus;

  @ApiPropertyOptional({ example: true, description: 'Active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
